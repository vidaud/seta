import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime

# the following function counts all the plenary-session PDF files in the different languages, gives some
# percentage and write it to a txt file

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")
date_time = now.strftime("%Y%m%d%H%M%S")


base_folder = startDir + '/EURPARL/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of log folder if it does not exist then is created
loggingFolder = base_folder + 'logs/logStats'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

print('logging folder {}'.format(loggingFolder))
# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/logStats_" + date_time + ".txt")

# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()

# the following function counts all the plenary-session PDF files in the different languages, gives some
# percentage and write it to a txt file
def countingFilesTypesS(readFolder):
    totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))
    logger.info('Files with pdf ext {}:'.format(totalFiles))

    verbatimCounter = len(glob.glob1(readFolder, "CRE*.pdf"))
    # Start counting the objects' agenda in the different languages
    agendaCounter = len(glob.glob1(readFolder, "OJ*.pdf"))
    agendaCounterBG = len(glob.glob1(readFolder, "OJ*_bg.pdf"))
    agendaCounterCS = len(glob.glob1(readFolder, "OJ*_cs.pdf"))
    agendaCounterDA = len(glob.glob1(readFolder, "OJ*_da.pdf"))
    agendaCounterDE = len(glob.glob1(readFolder, "OJ*_de.pdf"))
    agendaCounterEL = len(glob.glob1(readFolder, "OJ*_el.pdf"))
    agendaCounterEN = len(glob.glob1(readFolder, "OJ*_en.pdf"))
    agendaCounterES = len(glob.glob1(readFolder, "OJ*_es.pdf"))
    agendaCounterET = len(glob.glob1(readFolder, "OJ*_et.pdf"))
    agendaCounterFI = len(glob.glob1(readFolder, "OJ*_fi.pdf"))
    agendaCounterFR = len(glob.glob1(readFolder, "OJ*_fr.pdf"))
    agendaCounterGA = len(glob.glob1(readFolder, "OJ*_ga.pdf"))
    agendaCounterHR = len(glob.glob1(readFolder, "OJ*_hr.pdf"))
    agendaCounterHU = len(glob.glob1(readFolder, "OJ*_hu.pdf"))
    agendaCounterIT = len(glob.glob1(readFolder, "OJ*_it.pdf"))
    agendaCounterLT = len(glob.glob1(readFolder, "OJ*_lt.pdf"))
    agendaCounterLV = len(glob.glob1(readFolder, "OJ*_lv.pdf"))
    agendaCounterMT = len(glob.glob1(readFolder, "OJ*_mt.pdf"))
    agendaCounterNL = len(glob.glob1(readFolder, "OJ*_nl.pdf"))
    agendaCounterPL = len(glob.glob1(readFolder, "OJ*_pl.pdf"))
    agendaCounterPT = len(glob.glob1(readFolder, "OJ*_pt.pdf"))
    agendaCounterRO = len(glob.glob1(readFolder, "OJ*_ro.pdf"))
    agendaCounterSK = len(glob.glob1(readFolder, "OJ*_sk.pdf"))
    agendaCounterSL = len(glob.glob1(readFolder, "OJ*_sl.pdf"))
    agendaCounterSV = len(glob.glob1(readFolder, "OJ*_sv.pdf"))

    # Start counting the objects' minutes in the different languages
    minutesCounter = len(glob.glob1(readFolder, "PV*.pdf"))
    minutesCounterBG = len(glob.glob1(readFolder, "PV*_bg.pdf"))
    minutesCounterCS = len(glob.glob1(readFolder, "PV*_cs.pdf"))
    minutesCounterDA = len(glob.glob1(readFolder, "PV*_da.pdf"))
    minutesCounterDE = len(glob.glob1(readFolder, "PV*_de.pdf"))
    minutesCounterEL = len(glob.glob1(readFolder, "PV*_el.pdf"))
    minutesCounterEN = len(glob.glob1(readFolder, "PV*_en.pdf"))
    minutesCounterES = len(glob.glob1(readFolder, "PV*_es.pdf"))
    minutesCounterET = len(glob.glob1(readFolder, "PV*_et.pdf"))
    minutesCounterFI = len(glob.glob1(readFolder, "PV*_fi.pdf"))
    minutesCounterFR = len(glob.glob1(readFolder, "PV*_fr.pdf"))
    minutesCounterGA = len(glob.glob1(readFolder, "PV*_ga.pdf"))
    minutesCounterHR = len(glob.glob1(readFolder, "PV*_hr.pdf"))
    minutesCounterHU = len(glob.glob1(readFolder, "PV*_hu.pdf"))
    minutesCounterIT = len(glob.glob1(readFolder, "PV*_it.pdf"))
    minutesCounterLT = len(glob.glob1(readFolder, "PV*_lt.pdf"))
    minutesCounterLV = len(glob.glob1(readFolder, "PV*_lv.pdf"))
    minutesCounterMT = len(glob.glob1(readFolder, "PV*_mt.pdf"))
    minutesCounterNL = len(glob.glob1(readFolder, "PV*_nl.pdf"))
    minutesCounterPL = len(glob.glob1(readFolder, "PV*_pl.pdf"))
    minutesCounterPT = len(glob.glob1(readFolder, "PV*_pt.pdf"))
    minutesCounterRO = len(glob.glob1(readFolder, "PV*_ro.pdf"))
    minutesCounterSK = len(glob.glob1(readFolder, "PV*_sk.pdf"))
    minutesCounterSL = len(glob.glob1(readFolder, "PV*_sl.pdf"))
    minutesCounterSV = len(glob.glob1(readFolder, "PV*_sv.pdf"))

    # if the folder stats and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlSessPdf.txt'):
        with open(base_folder + '/stats/outputStsEurParlSessPdf.txt', 'w') as file:
            file.close()
    with open(base_folder + '/stats/outputStsEurParlSessPdf.txt', 'w') as a:
        a.write('Total files count {}:'.format(totalFiles) + '\n\n')
        # Start writing EP plenary sitting verbatim report of proceedings
        a.write('Number of EP plenary sitting verbatim report of proceedings: {}'.format(verbatimCounter) + '\n\n')
        # Start writing object plenary part-session agenda
        a.write('Number of EP plenary part-session agenda : {}'.format(agendaCounter) + '\n')
        a.write('Number of EP plenary part-session agenda BG: {}'.format(agendaCounterBG) + '\n')
        a.write('Number of EP plenary part-session agenda CS: {}'.format(agendaCounterCS) + '\n')
        a.write('Number of EP plenary part-session agenda DA: {}'.format(agendaCounterDA) + '\n')
        a.write('Number of EP plenary part-session agenda DE: {}'.format(agendaCounterDE) + '\n')
        a.write('Number of EP plenary part-session agenda EL: {}'.format(agendaCounterEL) + '\n')
        a.write('Number of EP plenary part-session agenda EN: {}'.format(agendaCounterEN) + '\n')
        a.write('Number of EP plenary part-session agenda ES: {}'.format(agendaCounterES) + '\n')
        a.write('Number of EP plenary part-session agenda ET: {}'.format(agendaCounterET) + '\n')
        a.write('Number of EP plenary part-session agenda FI: {}'.format(agendaCounterFI) + '\n')
        a.write('Number of EP plenary part-session agenda FR: {}'.format(agendaCounterFR) + '\n')
        a.write('Number of EP plenary part-session agenda GA: {}'.format(agendaCounterGA) + '\n')
        a.write('Number of EP plenary part-session agenda HR: {}'.format(agendaCounterHR) + '\n')
        a.write('Number of EP plenary part-session agenda HU: {}'.format(agendaCounterHU) + '\n')
        a.write('Number of EP plenary part-session agenda IT: {}'.format(agendaCounterIT) + '\n')
        a.write('Number of EP plenary part-session agenda LT: {}'.format(agendaCounterLT) + '\n')
        a.write('Number of EP plenary part-session agenda LV: {}'.format(agendaCounterLV) + '\n')
        a.write('Number of EP plenary part-session agenda MT: {}'.format(agendaCounterMT) + '\n')
        a.write('Number of EP plenary part-session agenda NL: {}'.format(agendaCounterNL) + '\n')
        a.write('Number of EP plenary part-session agenda PL: {}'.format(agendaCounterPL) + '\n')
        a.write('Number of EP plenary part-session agenda PT: {}'.format(agendaCounterPT) + '\n')
        a.write('Number of EP plenary part-session agenda RO: {}'.format(agendaCounterRO) + '\n')
        a.write('Number of EP plenary part-session agenda SK: {}'.format(agendaCounterSK) + '\n')
        a.write('Number of EP plenary part-session agenda SL: {}'.format(agendaCounterSL) + '\n')
        a.write('Number of EP plenary part-session agenda SV: {}'.format(agendaCounterSV) + '\n\n')
        # Start writing object EP plenary sitting minutes
        a.write('Number of EP plenary sitting minutes: {}'.format(minutesCounter) + '\n')
        # Start writing object EP plenary sitting verbatim report of proceedings for the different languages
        a.write('Number of EP plenary sitting verbatim report of proceedings BG: {}'.format(minutesCounterBG) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings CS: {}'.format(minutesCounterCS) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings DA: {}'.format(minutesCounterDA) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings DE: {}'.format(minutesCounterDE) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings EL: {}'.format(minutesCounterEL) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings EN: {}'.format(minutesCounterEN) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings ES: {}'.format(minutesCounterES) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings ET: {}'.format(minutesCounterET) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings FI: {}'.format(minutesCounterFI) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings FR: {}'.format(minutesCounterFR) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings GA: {}'.format(minutesCounterGA) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings HR: {}'.format(minutesCounterHR) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings HU: {}'.format(minutesCounterHU) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings IT: {}'.format(minutesCounterIT) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings LT: {}'.format(minutesCounterLT) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings LV: {}'.format(minutesCounterLV) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings MT: {}'.format(minutesCounterMT) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings NL: {}'.format(minutesCounterNL) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings PL: {}'.format(minutesCounterPL) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings PT: {}'.format(minutesCounterPT) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings RO: {}'.format(minutesCounterRO) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings SK: {}'.format(minutesCounterSK) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings SL: {}'.format(minutesCounterSL) + '\n')
        a.write('Number of EP plenary sitting verbatim report of proceedings SV: {}'.format(minutesCounterSV) + '\n\n')

        # Start writing object percentage of EP plenary part-session agenda for the different languages
        a.write('percentage of EP plenary sitting verbatim report of proceedings: {:.3%}'.format(
            verbatimCounter / totalFiles) + '\n\n')
        a.write('percentage of EP plenary part-session agenda: {:.3%}'.format(agendaCounter / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda BG: {:.3%}'.format(agendaCounterBG / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda CS: {:.3%}'.format(agendaCounterCS / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda DA: {:.3%}'.format(agendaCounterDA / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda DE: {:.3%}'.format(agendaCounterDE / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda EL: {:.3%}'.format(agendaCounterEL / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda EN: {:.3%}'.format(agendaCounterEN / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda ES: {:.3%}'.format(agendaCounterES / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda ET: {:.3%}'.format(agendaCounterET / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda FI: {:.3%}'.format(agendaCounterFI / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda FR: {:.3%}'.format(agendaCounterFR / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda GA: {:.3%}'.format(agendaCounterGA / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda HR: {:.3%}'.format(agendaCounterHR / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda HU: {:.3%}'.format(agendaCounterHU / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda IT: {:.3%}'.format(agendaCounterIT / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda LT: {:.3%}'.format(agendaCounterLT / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda LV: {:.3%}'.format(agendaCounterLV / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda MT: {:.3%}'.format(agendaCounterMT / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda NL: {:.3%}'.format(agendaCounterNL / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda PL: {:.3%}'.format(agendaCounterPL / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda PT: {:.3%}'.format(agendaCounterPT / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda RO: {:.3%}'.format(agendaCounterRO / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda SK: {:.3%}'.format(agendaCounterSK / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda SL: {:.3%}'.format(agendaCounterSL / totalFiles) + '\n')
        a.write('percentage of EP plenary part-session agenda SV: {:.3%}'.format(agendaCounterSV / totalFiles) + '\n\n')

        # Start writing object percentage of EP plenary part-session agenda for the different languages
        a.write('percentage of EP plenary sitting minutes: {:.3%}'.format(minutesCounter / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings BG: {:.3%}'.format(
            minutesCounterBG / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings CS: {:.3%}'.format(
            minutesCounterCS / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings DA: {:.3%}'.format(
            minutesCounterDA / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings DE: {:.3%}'.format(
            minutesCounterDE / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings EL: {:.3%}'.format(
            minutesCounterEL / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings EN: {:.3%}'.format(
            minutesCounterEN / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings ES: {:.3%}'.format(
            minutesCounterES / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings ET: {:.3%}'.format(
            minutesCounterET / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings FI: {:.3%}'.format(
            minutesCounterFI / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings FR: {:.3%}'.format(
            minutesCounterFR / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings GA: {:.3%}'.format(
            minutesCounterGA / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings HR: {:.3%}'.format(
            minutesCounterHR / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings HU: {:.3%}'.format(
            minutesCounterHU / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings IT: {:.3%}'.format(
            minutesCounterIT / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings LT: {:.3%}'.format(
            minutesCounterLT / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings LV: {:.3%}'.format(
            minutesCounterLV / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings MT: {:.3%}'.format(
            minutesCounterMT / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings NL: {:.3%}'.format(
            minutesCounterNL / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings PL: {:.3%}'.format(
            minutesCounterPL / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings PT: {:.3%}'.format(
            minutesCounterPT / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings RO: {:.3%}'.format(
            minutesCounterRO / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings SK: {:.3%}'.format(
            minutesCounterSK / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings SL: {:.3%}'.format(
            minutesCounterSL / totalFiles) + '\n')
        a.write('percentage of EP plenary sitting verbatim report of proceedings SV: {:.3%}'.format(
            minutesCounterSV / totalFiles) + '\n')
