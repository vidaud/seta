# pylint: disable=protected-access, missing-docstring

import asyncio
import logging
import functools
from concurrent.futures import ProcessPoolExecutor

import re
from nltk.tokenize import word_tokenize
from nltk.text import ConcordanceIndex

logger = logging.getLogger(__name__)

pool = ProcessPoolExecutor(max_workers=1)


async def _execute_word_tokenize(text: str):
    loop = asyncio.get_event_loop()

    return await loop.run_in_executor(
        pool,
        functools.partial(word_tokenize, text=text),
    )


async def compute_concordance(abstract, term, text) -> list[tuple[str, str, str]]:
    concordances = []
    terms = []

    if term:
        terms = _to_term_list(term)

    if abstract and term:
        concordances = await _get_concordance(abstract, terms, 100, 100)

    if text and term:
        text_concordances = await _get_concordance(text, terms, 100, 100)
        concordances = concordances + text_concordances

    logger.debug("concordances: %s", concordances)

    return concordances


def _to_term_list(term):
    ts = (
        term.replace("(", "")
        .replace(")", "")
        .replace(" ", "_")
        .replace("_AND_", " ")
        .replace("_OR_", " ")
        .split(" ")
    )
    return [t.replace("_", " ").strip('"') for t in ts]


async def _get_concordance(
    text="", phrases=None, width=150, lines=25
) -> list[tuple[str, str, str]]:
    # lines=0 is unlimited number of concordance lines
    if phrases is None:
        phrases = []

    m_len = 0
    for p in phrases:
        if m_len < len(p):
            m_len = len(p)
    tokens = await _execute_word_tokenize(text)

    conc_ind = ConcordanceIndex(tokens, (lambda s: s.lower()))
    concordances = []

    for phrase in phrases:
        conc = await _concordance(conc_ind, phrase, width, lines, m_len)

        logger.debug("phrase: %s, concordances: %s", phrase, conc)

        for i in conc:
            concordances.append(i)

    return concordances


def _de_tokenize(words):
    """
    Un-tokenizing a text undoes the tokenizing operation, restoring
    punctuation and spaces to the places that people expect them to be.
    Ideally, `untokenize(tokenize(text))` should be identical to `text`,
    except for line breaks.
    """
    text = " ".join(words)
    step1 = text.replace("`` ", '"').replace(" ''", '"').replace(". . .", "...")
    step2 = step1.replace(" ( ", " (").replace(" ) ", ") ")
    step3 = re.sub(r' ([.,:;?!%]+)([ \'"`])', r"\1\2", step2)
    step4 = re.sub(r" ([.,:;?!%]+)$", r"\1", step3)
    step5 = step4.replace(" '", "'").replace(" n't", "n't").replace("can not", "cannot")
    step6 = step5.replace(" ` ", " '")
    return step6.strip()


async def _concordance(
    ci, phrase, width=150, lines=25, width_add=10
) -> list[tuple[str, str, str]]:
    """
    Rewrite of nltk.text.ConcordanceIndex.print_concordance that returns results
    instead of printing them. And accepts phrases.

    See:
    http://www.nltk.org/api/nltk.html#nltk.text.ConcordanceIndex.print_concordance
    """
    phrase_tokens = await _execute_word_tokenize(phrase.lower())
    context = width // 4  # approx number of words of context

    plen = len(phrase_tokens)
    t_len = len(ci._tokens)
    offsets = ci.offsets(phrase_tokens[0])

    if not offsets:
        return []

    results = []

    phrase = []
    if lines != 0:
        lines = min(lines, len(offsets))
    else:
        lines = len(offsets)
    for i in offsets:
        if lines <= 0:
            break

        for y in range(plen):
            # TODO: review logic
            if (t_len <= i + y) or (plen <= y):
                logger.debug(
                    "concordance for y in range(plen) break on t_len:%s, plen:%s, y:%s, i:%s",
                    t_len,
                    plen,
                    y,
                    i,
                )
                break

            if ci._tokens[i + y].lower() == phrase_tokens[y]:
                if y + 1 == plen:
                    if i - context < 0:
                        left = " " * width + _de_tokenize(ci._tokens[0:i])
                    else:
                        left = " " * width + _de_tokenize(ci._tokens[i - context : i])
                    if i + y + context > t_len:
                        right = _de_tokenize(ci._tokens[i + 1 + y : t_len])
                    else:
                        right = _de_tokenize(ci._tokens[i + 1 + y : i + y + context])
                    left = left[-width:]
                    right = right[: width + +width_add]
                    ph = _de_tokenize(ci._tokens[i : i + y + 1])
                    line = (left, ph, right)

                    results.append(line)
                    lines -= 1
            else:
                break
    return results
