import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime

# the following function counts all the parliamentary-questions PDF files in the different languages, gives some
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

# the following function counts all the parliamentary-questions PDF files in the different languages, gives some
# percentage and write it to a txt file
def countingFilesTypesQ(readFolder):
    countQst = 0
    countAsw = 0
    print('read folder {}'.format(readFolder))

    # Variables of Questions for Oral Answer
    totQstOralAnsw = 0
    qstOralAnswBG = 0
    qstOralAnswCS = 0
    qstOralAnswDA = 0
    qstOralAnswDE = 0
    qstOralAnswEL = 0
    qstOralAnswEN = 0
    qstOralAnswES = 0
    qstOralAnswET = 0
    qstOralAnswFI = 0
    qstOralAnswFR = 0
    qstOralAnswGA = 0
    qstOralAnswHR = 0
    qstOralAnswHU = 0
    qstOralAnswIT = 0
    qstOralAnswLT = 0
    qstOralAnswLV = 0
    qstOralAnswMT = 0
    qstOralAnswNL = 0
    qstOralAnswPL = 0
    qstOralAnswPT = 0
    qstOralAnswRO = 0
    qstOralAnswSK = 0
    qstOralAnswSL = 0
    qstOralAnswSV = 0

    # Variables for oral Answer
    totOralAnsw = 0
    oralAnswBG = 0
    oralAnswCS = 0
    oralAnswDA = 0
    oralAnswDE = 0
    oralAnswEL = 0
    oralAnswEN = 0
    oralAnswES = 0
    oralAnswET = 0
    oralAnswFI = 0
    oralAnswFR = 0
    oralAnswGA = 0
    oralAnswHR = 0
    oralAnswHU = 0
    oralAnswIT = 0
    oralAnswLT = 0
    oralAnswLV = 0
    oralAnswMT = 0
    oralAnswNL = 0
    oralAnswPL = 0
    oralAnswPT = 0
    oralAnswRO = 0
    oralAnswSK = 0
    oralAnswSL = 0
    oralAnswSV = 0

    # Variables for Question Time asked during the period set aside for questions during plenary sittings
    qstTimeAnsw = 0
    qstTimeAnswBG = 0
    qstTimeAnswCS = 0
    qstTimeAnswDA = 0
    qstTimeAnswDE = 0
    qstTimeAnswEL = 0
    qstTimeAnswEN = 0
    qstTimeAnswES = 0
    qstTimeAnswET = 0
    qstTimeAnswFI = 0
    qstTimeAnswFR = 0
    qstTimeAnswGA = 0
    qstTimeAnswHR = 0
    qstTimeAnswHU = 0
    qstTimeAnswIT = 0
    qstTimeAnswLT = 0
    qstTimeAnswLV = 0
    qstTimeAnswMT = 0
    qstTimeAnswNL = 0
    qstTimeAnswPL = 0
    qstTimeAnswPT = 0
    qstTimeAnswRO = 0
    qstTimeAnswSK = 0
    qstTimeAnswSL = 0
    qstTimeAnswSV = 0

    # Variables of Answer for Question Time asked during the period set aside during plenary sittings
    answQstTime = 0
    answQstTimeBG = 0
    answQstTimeCS = 0
    answQstTimeDA = 0
    answQstTimeDE = 0
    answQstTimeEL = 0
    answQstTimeEN = 0
    answQstTimeES = 0
    answQstTimeET = 0
    answQstTimeFI = 0
    answQstTimeFR = 0
    answQstTimeGA = 0
    answQstTimeHR = 0
    answQstTimeHU = 0
    answQstTimeIT = 0
    answQstTimeLT = 0
    answQstTimeLV = 0
    answQstTimeMT = 0
    answQstTimeNL = 0
    answQstTimePL = 0
    answQstTimePT = 0
    answQstTimeRO = 0
    answQstTimeSK = 0
    answQstTimeSL = 0
    answQstTimeSV = 0

    # Variable for Written questions with a request for a written answer
    wrtQstReqAnsw = 0
    wrtQstReqAnswBG = 0
    wrtQstReqAnswCS = 0
    wrtQstReqAnswDA = 0
    wrtQstReqAnswDE = 0
    wrtQstReqAnswEL = 0
    wrtQstReqAnswEN = 0
    wrtQstReqAnswES = 0
    wrtQstReqAnswET = 0
    wrtQstReqAnswFI = 0
    wrtQstReqAnswFR = 0
    wrtQstReqAnswGA = 0
    wrtQstReqAnswHR = 0
    wrtQstReqAnswHU = 0
    wrtQstReqAnswIT = 0
    wrtQstReqAnswLT = 0
    wrtQstReqAnswLV = 0
    wrtQstReqAnswMT = 0
    wrtQstReqAnswNL = 0
    wrtQstReqAnswPL = 0
    wrtQstReqAnswPT = 0
    wrtQstReqAnswRO = 0
    wrtQstReqAnswSK = 0
    wrtQstReqAnswSL = 0
    wrtQstReqAnswSV = 0

    # Variable for Answer for written questions with a request for a written answer
    answWrtQstReq = 0
    answWrtQstReqBG = 0
    answWrtQstReqCS = 0
    answWrtQstReqDA = 0
    answWrtQstReqDE = 0
    answWrtQstReqEL = 0
    answWrtQstReqEN = 0
    answWrtQstReqES = 0
    answWrtQstReqET = 0
    answWrtQstReqFI = 0
    answWrtQstReqFR = 0
    answWrtQstReqGA = 0
    answWrtQstReqHR = 0
    answWrtQstReqHU = 0
    answWrtQstReqIT = 0
    answWrtQstReqLT = 0
    answWrtQstReqLV = 0
    answWrtQstReqMT = 0
    answWrtQstReqNL = 0
    answWrtQstReqPL = 0
    answWrtQstReqPT = 0
    answWrtQstReqRO = 0
    answWrtQstReqSK = 0
    answWrtQstReqSL = 0
    answWrtQstReqSV = 0

# Start looking for differente types of files to count
    for file in os.listdir(r'' + readFolder):
        if ".pdf" in file and 'ASW' not in file:
            countQst += 1
        if '.pdf' in file and 'ASW' in file:
            countAsw += 1
        # Counting questions for oral answer
        if ".pdf" in file and 'E-' in file and 'ASW' not in file:
            totQstOralAnsw += 1
        if "_bg.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswBG += 1
        if "_cs.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswCS += 1
        if "_da.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswDA += 1
        if "_de.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswDE += 1
        if "_el.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswEL += 1
        if "_en.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswEN += 1
        if "_es.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswES += 1
        if "_et.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswET += 1
        if "_fi.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswFI += 1
        if "_fr.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswFR += 1
        if "_ga.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswGA += 1
        if "_hr.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswHR += 1
        if "_hu.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswHU += 1
        if "_it.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswIT += 1
        if "_lt.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswLT += 1
        if "_lv.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswLV += 1
        if "_mt.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswMT += 1
        if "_nl.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswNL += 1
        if "_pl.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswPL += 1
        if "_pt.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswPT += 1
        if "_ro.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswRO += 1
        if "_sk.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswSK += 1
        if "_sl.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswSL += 1
        if "_sv.pdf" in file and 'E-' in file and 'ASW' not in file:
            qstOralAnswSV += 1

        # Counting answers for oral answer
        if ".pdf" in file and 'E-' in file and 'ASW' in file:
            totOralAnsw += 1
        if "_bg.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswBG += 1
        if "_cs.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswCS += 1
        if "_da.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswDA += 1
        if "_de.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswDE += 1
        if "_el.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswEL += 1
        if "_en.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswEN += 1
        if "_es.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswES += 1
        if "_et.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswET += 1
        if "_fi.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswFI += 1
        if "_fr.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswFR += 1
        if "_ga.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswGA += 1
        if "_hr.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswHR += 1
        if "_hu.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswHU += 1
        if "_it.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswIT += 1
        if "_lt.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswLT += 1
        if "_lv.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswLV += 1
        if "_mt.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswMT += 1
        if "_nl.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswNL += 1
        if "_pl.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswPL += 1
        if "_pt.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswPT += 1
        if "_ro.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswRO += 1
        if "_sk.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswSK += 1
        if "_sl.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswSL += 1
        if "_sv.pdf" in file and 'E-' in file and 'ASW' in file:
            oralAnswSV += 1

        # Counting Questions for Question Time asked during the period set aside for questions during plenary sittings
        if ".pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnsw += 1
        if "_bg.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswBG += 1
        if "_cs.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswCS += 1
        if "_da.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswDA += 1
        if "_de.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswDE += 1
        if "_el.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswEL += 1
        if "_en.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswEN += 1
        if "_es.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswES += 1
        if "_et.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswET += 1
        if "_fi.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswFI += 1
        if "_fr.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswFR += 1
        if "_ga.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswGA += 1
        if "_hr.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswHR += 1
        if "_hu.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswHU += 1
        if "_it.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswIT += 1
        if "_lt.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswLT += 1
        if "_lv.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswLV += 1
        if "_mt.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswMT += 1
        if "_nl.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswNL += 1
        if "_pl.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswPL += 1
        if "_pt.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswPT += 1
        if "_ro.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswRO += 1
        if "_sk.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswSK += 1
        if "_sl.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswSL += 1
        if "_sv.pdf" in file and 'O-' in file and 'ASW' not in file:
            qstTimeAnswSV += 1

        # Counting answer for Question Time asked during the period set aside during plenary sittings
        if ".pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTime += 1
        if "_bg.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeBG += 1
        if "_cs.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeCS += 1
        if "_da.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeDA += 1
        if "_de.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeDE += 1
        if "_el.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeEL += 1
        if "_en.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeEN += 1
        if "_es.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeES += 1
        if "_et.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeET += 1
        if "_fi.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeFI += 1
        if "_fr.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeFR += 1
        if "_ga.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeGA += 1
        if "_hr.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeHR += 1
        if "_hu.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeHU += 1
        if "_it.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeIT += 1
        if "_lt.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeLT += 1
        if "_lv.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeLV += 1
        if "_mt.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeMT += 1
        if "_nl.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeNL += 1
        if "_pl.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimePL += 1
        if "_pt.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimePT += 1
        if "_ro.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeRO += 1
        if "_sk.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeSK += 1
        if "_sl.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeSL += 1
        if "_sv.pdf" in file and 'O-' in file and 'ASW' in file:
            answQstTimeSV += 1

        # Counting written questions with a request for a written answer
        if ".pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnsw += 1
        if "_bg.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswBG += 1
        if "_cs.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswCS += 1
        if "_da.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswDA += 1
        if "_de.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswDE += 1
        if "_el.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswEL += 1
        if "_en.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswEN += 1
        if "_es.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswES += 1
        if "_et.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswET += 1
        if "_fi.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswFI += 1
        if "_fr.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswFR += 1
        if "_ga.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswGA += 1
        if "_hr.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswHR += 1
        if "_hu.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswHU += 1
        if "_it.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswIT += 1
        if "_lt.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswLT += 1
        if "_lv.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswLV += 1
        if "_mt.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswMT += 1
        if "_nl.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswNL += 1
        if "_pl.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswPL += 1
        if "_pt.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswPT += 1
        if "_ro.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswRO += 1
        if "_sk.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswSK += 1
        if "_sl.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswSL += 1
        if "_sv.pdf" in file and 'P-' in file and 'ASW' not in file:
            wrtQstReqAnswSV += 1

        # Counting Answer for written questions with a request for a written answer
        if ".pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReq += 1
        if "_bg.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqBG += 1
        if "_cs.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqCS += 1
        if "_da.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqDA += 1
        if "_de.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqDE += 1
        if "_el.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqEL += 1
        if "_en.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqEN += 1
        if "_es.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqES += 1
        if "_et.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqET += 1
        if "_fi.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqFI += 1
        if "_fr.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqFR += 1
        if "_ga.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqGA += 1
        if "_hr.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqHR += 1
        if "_hu.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqHU += 1
        if "_it.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqIT += 1
        if "_lt.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqLT += 1
        if "_lv.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqLV += 1
        if "_mt.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqMT += 1
        if "_nl.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqNL += 1
        if "_pl.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqPL += 1
        if "_pt.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqPT += 1
        if "_ro.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqRO += 1
        if "_sk.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqSK += 1
        if "_sl.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqSL += 1
        if "_sv.pdf" in file and 'P-' in file and 'ASW' in file:
            answWrtQstReqSV += 1

    totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))
    logger.info('Total files with pdf ext {}:'.format(totalFiles))
    logger.info('Number of questions  {}:'.format(countQst))
    logger.info('Number of answers  {}:'.format(countAsw))

    # Checking  if the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlParlQstpdf.txt'):
        with open(base_folder + '/stats/outputStsEurParlParlQstpdf.txt', 'w') as file:
            file.close()

    # start writing the file with the results from the counting from the different languages
    with open(base_folder + '/stats/outputStsEurParlParlQstpdf.txt', 'w') as a:

        a.write('Total files with pdf ext: {}'.format(totalFiles) + '\n')
        a.write('Number of questions:  {}'.format(countQst) + '\n')
        a.write('Number of answers:  {}'.format(countAsw) + '\n\n')

        # Object to write: Questions for oral answer
        a.write(
            'Number of Questions for oral answer dealt with during plenary sittings: {}'.format(totQstOralAnsw) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Bulgarian) bg: {}'.format(
            qstOralAnswBG) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Czech) cs: {}'.format(
            qstOralAnswCS) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Danish) da: {}'.format(
            qstOralAnswDA) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(German) ge: {}'.format(
            qstOralAnswDE) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Greek): {}'.format(
            qstOralAnswEL) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(English): {}'.format(
            qstOralAnswEN) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Spanish): {}'.format(
            qstOralAnswES) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Estonian): {}'.format(
            qstOralAnswET) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Finnish): {}'.format(
            qstOralAnswFI) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(French): {}'.format(
            qstOralAnswFR) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Irish): {}'.format(
            qstOralAnswGA) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Croatian): {}'.format(
            qstOralAnswHR) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Hungarian): {}'.format(
            qstOralAnswHU) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Italian): {}'.format(
            qstOralAnswIT) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Lithuanian): {}'.format(
            qstOralAnswLT) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Latvian): {}'.format(
            qstOralAnswLV) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Maltese): {}'.format(
            qstOralAnswMT) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Dutch): {}'.format(
            qstOralAnswNL) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Polish): {}'.format(
            qstOralAnswPL) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Portuguese): {}'.format(
            qstOralAnswPT) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Romanian): {}'.format(
            qstOralAnswRO) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Slovak): {}'.format(
            qstOralAnswSK) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Slovenian): {}'.format(
            qstOralAnswSL) + '\n')
        a.write('Number of Questions for oral answer dealt with during plenary sittings(Swedish): {}'.format(
            qstOralAnswSV) + '\n\n')

        # Object to write: Oral Answers for Questions
        a.write(
            'Number of Oral Answers for Questions dealt with during plenary sittings: {}'.format(totOralAnsw) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Bulgarian) bg: {}'.format(
            oralAnswBG) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Czech) cs: {}'.format(
            oralAnswCS) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Danish) da: {}'.format(
            oralAnswDA) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(German) ge: {}'.format(
            oralAnswDE) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Greek): {}'.format(
            oralAnswEL) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(English): {}'.format(
            oralAnswEN) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Spanish): {}'.format(
            oralAnswES) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Estonian): {}'.format(
            oralAnswET) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Finnish): {}'.format(
            oralAnswFI) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(French): {}'.format(
            oralAnswFR) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Irish): {}'.format(
            oralAnswGA) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Croatian): {}'.format(
            oralAnswHR) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Hungarian): {}'.format(
            oralAnswHU) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Italian): {}'.format(
            oralAnswIT) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Lithuanian): {}'.format(
            oralAnswLT) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Latvian): {}'.format(
            oralAnswLV) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Maltese): {}'.format(
            oralAnswMT) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Dutch): {}'.format(
            oralAnswNL) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Polish): {}'.format(
            oralAnswPL) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Portuguese): {}'.format(
            oralAnswPT) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Romanian): {}'.format(
            oralAnswRO) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Slovak): {}'.format(
            oralAnswSK) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Slovenian): {}'.format(
            oralAnswSL) + '\n')
        a.write('Number of Oral Answers for Questions dealt with during plenary sittings(Swedish): {}'.format(
            oralAnswSV) + '\n\n')

        # Object to write: Questions for Question Time asked during the period set aside for questions during plenary
        # sittings
        a.write('Number of Questions for Question Time asked during the period: {}'.format(qstTimeAnsw) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Bulgarian): {}'.format(
                qstTimeAnswBG) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Czech): {}'.format(qstTimeAnswCS) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Danish): {}'.format(qstTimeAnswDA) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (German): {}'.format(qstTimeAnswDE) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Greek): {}'.format(qstTimeAnswEL) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (English): {}'.format(qstTimeAnswEN) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Spanish): {}'.format(qstTimeAnswES) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Estonian): {}'.format(qstTimeAnswET) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Finnish): {}'.format(qstTimeAnswFI) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (French): {}'.format(qstTimeAnswFR) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Irish): {}'.format(qstTimeAnswGA) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Croatian): {}'.format(qstTimeAnswHR) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Hungarian): {}'.format(
                qstTimeAnswHU) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Italian): {}'.format(qstTimeAnswIT) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Lithuanian): {}'.format(
                qstTimeAnswLT) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Latvian): {}'.format(qstTimeAnswLV) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Maltese): {}'.format(qstTimeAnswMT) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Dutch): {}'.format(qstTimeAnswNL) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Polish): {}'.format(qstTimeAnswPL) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Portuguese): {}'.format(
                qstTimeAnswPT) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Romanian): {}'.format(qstTimeAnswRO) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Slovak): {}'.format(qstTimeAnswSK) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Slovenian): {}'.format(
                qstTimeAnswSL) + '\n')
        a.write(
            'Number of Questions for Question Time asked during the period (Swedish): {}'.format(
                qstTimeAnswSV) + '\n\n')

        # Object to write Answer for Question Time asked during the period set aside for questions during plenary
        # sittings
        a.write('Number of Answers for Question Time asked during the period: {}'.format(answQstTime) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Bulgarian): {}'.format(
                answQstTimeBG) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Czech): {}'.format(answQstTimeCS) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Danish): {}'.format(answQstTimeDA) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (German): {}'.format(answQstTimeDE) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Greek): {}'.format(answQstTimeEL) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (English): {}'.format(answQstTimeEN) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Spanish): {}'.format(answQstTimeES) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Estonian): {}'.format(answQstTimeET) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Finnish): {}'.format(answQstTimeFI) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (French): {}'.format(answQstTimeFR) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Irish): {}'.format(answQstTimeGA) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Croatian): {}'.format(answQstTimeHR) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Hungarian): {}'.format(
                answQstTimeHU) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Italian): {}'.format(answQstTimeIT) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Lithuanian): {}'.format(
                answQstTimeLT) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Latvian): {}'.format(answQstTimeLV) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Maltese): {}'.format(answQstTimeMT) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Dutch): {}'.format(answQstTimeNL) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Polish): {}'.format(answQstTimePL) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Portuguese): {}'.format(
                answQstTimePT) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Romanian): {}'.format(answQstTimeRO) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Slovak): {}'.format(answQstTimeSK) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Slovenian): {}'.format(
                answQstTimeSL) + '\n')
        a.write(
            'Number of Answers for Question Time asked during the period (Swedish): {}'.format(
                answQstTimeSV) + '\n\n')

        # Object to write: Written questions with a request for a written answer
        a.write('Number of Written questions with a request for a written answer : {}'.format(
            wrtQstReqAnsw) + '\n')
        a.write('Number of Written questions with a request for a written answer   (Bulgarian): {}'.format(
            wrtQstReqAnswBG) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Czech): {}'.format(
            wrtQstReqAnswCS) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Danish): {}'.format(
            wrtQstReqAnswDA) + '\n')
        a.write('Number of Written questions with a request for a written answer  (German): {}'.format(
            wrtQstReqAnswDE) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Greek): {}'.format(
            wrtQstReqAnswEL) + '\n')
        a.write('Number of Written questions with a request for a written answer  (English): {}'.format(
            wrtQstReqAnswEN) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Spanish): {}'.format(
            wrtQstReqAnswES) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Estonian): {}'.format(
            wrtQstReqAnswET) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Finnish): {}'.format(
            wrtQstReqAnswFI) + '\n')
        a.write('Number of Written questions with a request for a written answer  (French): {}'.format(
            wrtQstReqAnswFR) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Irish): {}'.format(
            wrtQstReqAnswGA) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Croatian): {}'.format(
            wrtQstReqAnswHR) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Hungarian): {}'.format(
            wrtQstReqAnswHU) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Italian): {}'.format(
            wrtQstReqAnswIT) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Lithuanian): {}'.format(
            wrtQstReqAnswLT) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Latvian): {}'.format(
            wrtQstReqAnswLV) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Maltese): {}'.format(
            wrtQstReqAnswMT) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Dutch): {}'.format(
            wrtQstReqAnswNL) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Polish): {}'.format(
            wrtQstReqAnswPL) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Portuguese): {}'.format(
            wrtQstReqAnswPT) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Romanian): {}'.format(
            wrtQstReqAnswRO) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Slovak): {}'.format(
            wrtQstReqAnswSK) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Slovenian): {}'.format(
            wrtQstReqAnswSL) + '\n')
        a.write('Number of Written questions with a request for a written answer  (Swedish): {}'.format(
            wrtQstReqAnswSV) + '\n\n')

        # Object to write: Number of Answers for written questions with a request for a written answer
        a.write('Number of Answers for written questions with a request for a written answer : {}'.format(
            answWrtQstReq) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer   (Bulgarian): {}'.format(
            answWrtQstReqBG) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Czech): {}'.format(
            answWrtQstReqCS) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Danish): {}'.format(
            answWrtQstReqDA) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (German): {}'.format(
            answWrtQstReqDE) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Greek): {}'.format(
            answWrtQstReqEL) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (English): {}'.format(
            answWrtQstReqEN) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Spanish): {}'.format(
            answWrtQstReqES) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Estonian): {}'.format(
            answWrtQstReqET) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Finnish): {}'.format(
            answWrtQstReqFI) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (French): {}'.format(
            answWrtQstReqFR) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Irish): {}'.format(
            answWrtQstReqGA) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Croatian): {}'.format(
            answWrtQstReqHR) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Hungarian): {}'.format(
            answWrtQstReqHU) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Italian): {}'.format(
            answWrtQstReqIT) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Lithuanian): {}'.format(
            answWrtQstReqLT) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Latvian): {}'.format(
            answWrtQstReqLV) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Maltese): {}'.format(
            answWrtQstReqMT) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Dutch): {}'.format(
            answWrtQstReqNL) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Polish): {}'.format(
            answWrtQstReqPL) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Portuguese): {}'.format(
            answWrtQstReqPT) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Romanian): {}'.format(
            answWrtQstReqRO) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Slovak): {}'.format(
            answWrtQstReqSK) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Slovenian): {}'.format(
            answWrtQstReqSL) + '\n')
        a.write('Number of Answers for written questions with a request for a written answer  (Swedish): {}'.format(
            answWrtQstReqSV) + '\n\n')

        # Object to write: percentage of Questions for oral answer dealt with during plenary sittings
        a.write('percentage of Questions for oral answer dealt with during plenary sittings: {:.3%}'.format(
            totQstOralAnsw / countQst) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings BG: {:.3%}'.format(
            qstOralAnswBG / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings CS: {:.3%}'.format(
            qstOralAnswCS / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings DA: {:.3%}'.format(
            qstOralAnswDA / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings DE: {:.3%}'.format(
            qstOralAnswDE / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings EL: {:.3%}'.format(
            qstOralAnswEL / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings EN: {:.3%}'.format(
            qstOralAnswEN / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings ES: {:.3%}'.format(
            qstOralAnswES / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings ET: {:.3%}'.format(
            qstOralAnswET / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings FI: {:.3%}'.format(
            qstOralAnswFI / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings FR: {:.3%}'.format(
            qstOralAnswFR / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings GA: {:.3%}'.format(
            qstOralAnswGA / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings HR: {:.3%}'.format(
            qstOralAnswHR / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings HU: {:.3%}'.format(
            qstOralAnswHU / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings IT: {:.3%}'.format(
            qstOralAnswIT / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings LT: {:.3%}'.format(
            qstOralAnswLT / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings LV: {:.3%}'.format(
            qstOralAnswLV / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings MT: {:.3%}'.format(
            qstOralAnswMT / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings NL: {:.3%}'.format(
            qstOralAnswNL / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings PL: {:.3%}'.format(
            qstOralAnswPL / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings PT: {:.3%}'.format(
            qstOralAnswPT / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings RO: {:.3%}'.format(
            qstOralAnswRO / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings SK: {:.3%}'.format(
            qstOralAnswSK / totQstOralAnsw) + '\n')
        a.write('percentage of Questions for oral answer dealt with during plenary sittings SL: {:.3%}'.format(
            qstOralAnswSL / totQstOralAnsw) + '\n')
        a.write(
            'percentage of Questions for oral answer dealt with during plenary sittings SV: {:.3%}'.format(
                qstOralAnswSV / totQstOralAnsw) + '\n\n')

        # Object to write: percentage of Answers for Oral Questions
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings: {:.3%}'.format(
            totOralAnsw / countAsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings BG: {:.3%}'.format(
            oralAnswBG / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings CS: {:.3%}'.format(
            oralAnswCS / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings DA: {:.3%}'.format(
            oralAnswDA / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings DE: {:.3%}'.format(
            oralAnswDE / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings EL: {:.3%}'.format(
            oralAnswEL / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings EN: {:.3%}'.format(
            oralAnswEN / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings ES: {:.3%}'.format(
            oralAnswES / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings ET: {:.3%}'.format(
            oralAnswET / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings FI: {:.3%}'.format(
            oralAnswFI / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings FR: {:.3%}'.format(
            oralAnswFR / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings GA: {:.3%}'.format(
            oralAnswGA / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings HR: {:.3%}'.format(
            oralAnswHR / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings HU: {:.3%}'.format(
            oralAnswHU / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings IT: {:.3%}'.format(
            oralAnswIT / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings LT: {:.3%}'.format(
            oralAnswLT / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings LV: {:.3%}'.format(
            oralAnswLV / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings MT: {:.3%}'.format(
            oralAnswMT / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings NL: {:.3%}'.format(
            oralAnswNL / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings PL: {:.3%}'.format(
            oralAnswPL / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings PT: {:.3%}'.format(
            oralAnswPT / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings RO: {:.3%}'.format(
            oralAnswRO / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings SK: {:.3%}'.format(
            oralAnswSK / totOralAnsw) + '\n')
        a.write('percentage of Answers for Oral Questions dealt with during plenary sittings SL: {:.3%}'.format(
            oralAnswSL / totOralAnsw) + '\n')
        a.write(
            'percentage of Answers for Oral Questions dealt with during plenary sittings SV: {:.3%}'.format(
                oralAnswSV / totOralAnsw) + '\n\n')

        # Object to write: percentage of Questions for Question Time asked during the period
        a.write(
            'percentage of Questions for Question Time asked during the period: {:.3%}'.format(
                qstTimeAnsw / countQst) + '\n')

        if qstTimeAnsw > 0:
            a.write('percentage of Questions for Question Time asked during the period BG: {:.3%}'.format(
                qstTimeAnswBG / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period CS: {:.3%}'.format(
                qstTimeAnswCS / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period DA: {:.3%}'.format(
                qstTimeAnswDA / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period DE: {:.3%}'.format(
                qstTimeAnswDE / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period EL: {:.3%}'.format(
                qstTimeAnswEL / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period EN: {:.3%}'.format(
                qstTimeAnswEN / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period ES: {:.3%}'.format(
                qstTimeAnswES / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period ET: {:.3%}'.format(
                qstTimeAnswET / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period FI: {:.3%}'.format(
                qstTimeAnswFI / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period FR: {:.3%}'.format(
                qstTimeAnswFR / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period GA: {:.3%}'.format(
                qstTimeAnswGA / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period HR: {:.3%}'.format(
                qstTimeAnswHR / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period HU: {:.3%}'.format(
                qstTimeAnswHU / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period IT: {:.3%}'.format(
                qstTimeAnswIT / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period LT: {:.3%}'.format(
                qstTimeAnswLT / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period LV: {:.3%}'.format(
                qstTimeAnswLV / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period MT: {:.3%}'.format(
                qstTimeAnswMT / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period NL: {:.3%}'.format(
                qstTimeAnswNL / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period PL: {:.3%}'.format(
                qstTimeAnswPL / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period PT: {:.3%}'.format(
                qstTimeAnswPT / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period RO: {:.3%}'.format(
                qstTimeAnswRO / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period SK: {:.3%}'.format(
                qstTimeAnswSK / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period SL: {:.3%}'.format(
                qstTimeAnswSL / qstTimeAnsw) + '\n')
            a.write('percentage of Questions for Question Time asked during the period SV: {:.3%}'.format(
                qstTimeAnswSV / qstTimeAnsw) + '\n\n')

        # Object to write: percentage of Answer for Questions Time asked during the period
        a.write(
            'percentage of Answer for Questions Time asked during the period: {:.3%}'.format(
                answQstTime / countAsw) + '\n')

        # Object to write: percentage of Written questions with a request for a written answer
        a.write('percentage of Written questions with a request for a written answer : {:.3%}'.format(
            wrtQstReqAnsw / countQst) + '\n')

        if wrtQstReqAnsw > 0:
            a.write('percentage of Written questions with a request for a written answer  BG: {:.3%}'.format(
                wrtQstReqAnswBG / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  CS: {:.3%}'.format(
                wrtQstReqAnswCS / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  DA: {:.3%}'.format(
                wrtQstReqAnswDA / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  DE: {:.3%}'.format(
                wrtQstReqAnswDE / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  EL: {:.3%}'.format(
                wrtQstReqAnswEL / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  EN: {:.3%}'.format(
                wrtQstReqAnswEN / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  ES: {:.3%}'.format(
                wrtQstReqAnswES / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  ET: {:.3%}'.format(
                wrtQstReqAnswET / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  FI: {:.3%}'.format(
                wrtQstReqAnswFI / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  FR: {:.3%}'.format(
                wrtQstReqAnswFR / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  GA: {:.3%}'.format(
                wrtQstReqAnswGA / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  HR: {:.3%}'.format(
                wrtQstReqAnswHR / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  HU: {:.3%}'.format(
                wrtQstReqAnswHU / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  IT: {:.3%}'.format(
                wrtQstReqAnswIT / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  LT: {:.3%}'.format(
                wrtQstReqAnswLT / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  LV: {:.3%}'.format(
                wrtQstReqAnswLV / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  MT: {:.3%}'.format(
                wrtQstReqAnswMT / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  NL: {:.3%}'.format(
                wrtQstReqAnswNL / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  PL: {:.3%}'.format(
                wrtQstReqAnswPL / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  PT: {:.3%}'.format(
                wrtQstReqAnswPT / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  RO: {:.3%}'.format(
                wrtQstReqAnswRO / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  SK: {:.3%}'.format(
                wrtQstReqAnswSK / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  SL: {:.3%}'.format(
                wrtQstReqAnswSL / wrtQstReqAnsw) + '\n')
            a.write('percentage of Written questions with a request for a written answer  SV: {:.3%}'.format(
                wrtQstReqAnswSV / wrtQstReqAnsw) + '\n\n')

        # Object to write: percentage of written answer for Written questions with a request
        a.write('percentage of written answer for Written questions with a request : {:.3%}'.format(
            answWrtQstReq / countAsw) + '\n')