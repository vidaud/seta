import logging
import os
import os.path
from datetime import datetime

# the following function counts all the  plenary-documents PDF files in the different languages, gives some percentage
# and write it to a txt file

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


# the following function counts all the  plenary-documents PDF files in the different languages, gives some percentage
# and write it to a txt file
def countingFilesTypesD(readFolder):
    totalParlDocs = 0
    totalAm = 0
    print('read folder {}'.format(readFolder))

    # variables for reports for oral answer
    totparlRep = 0
    parlRepBG = 0
    parlRepCS = 0
    parlRepDA = 0
    parlRepDE = 0
    parlRepEL = 0
    parlRepEN = 0
    parlRepES = 0
    parlRepET = 0
    parlRepFI = 0
    parlRepFR = 0
    parlRepGA = 0
    parlRepHR = 0
    parlRepHU = 0
    parlRepIT = 0
    parlRepLT = 0
    parlRepLV = 0
    parlRepMT = 0
    parlRepNL = 0
    parlRepPL = 0
    parlRepPT = 0
    parlRepRO = 0
    parlRepSK = 0
    parlRepSL = 0
    parlRepSV = 0

    # variables for Reports Amendments
    totparlDocAmRep = 0
    parlDocAmRepBG = 0
    parlDocAmRepCS = 0
    parlDocAmRepDA = 0
    parlDocAmRepDE = 0
    parlDocAmRepEL = 0
    parlDocAmRepEN = 0
    parlDocAmRepES = 0
    parlDocAmRepET = 0
    parlDocAmRepFI = 0
    parlDocAmRepFR = 0
    parlDocAmRepGA = 0
    parlDocAmRepHR = 0
    parlDocAmRepHU = 0
    parlDocAmRepIT = 0
    parlDocAmRepLT = 0
    parlDocAmRepLV = 0
    parlDocAmRepMT = 0
    parlDocAmRepNL = 0
    parlDocAmRepPL = 0
    parlDocAmRepPT = 0
    parlDocAmRepRO = 0
    parlDocAmRepSK = 0
    parlDocAmRepSL = 0
    parlDocAmRepSV = 0

    # variables for Motion for a resolution
    totMotRes = 0
    motResBG = 0
    motResCS = 0
    motResDA = 0
    motResDE = 0
    motResEL = 0
    motResEN = 0
    motResES = 0
    motResET = 0
    motResFI = 0
    motResFR = 0
    motResGA = 0
    motResHR = 0
    motResHU = 0
    motResIT = 0
    motResLT = 0
    motResLV = 0
    motResMT = 0
    motResNL = 0
    motResPL = 0
    motResPT = 0
    motResRO = 0
    motResSK = 0
    motResSL = 0
    motResSV = 0

    # variables Amendment for Motion for a resolution
    totMotResAm = 0
    motResAmBG = 0
    motResAmCS = 0
    motResAmDA = 0
    motResAmDE = 0
    motResAmEL = 0
    motResAmEN = 0
    motResAmES = 0
    motResAmET = 0
    motResAmFI = 0
    motResAmFR = 0
    motResAmGA = 0
    motResAmHR = 0
    motResAmHU = 0
    motResAmIT = 0
    motResAmLT = 0
    motResAmLV = 0
    motResAmMT = 0
    motResAmNL = 0
    motResAmPL = 0
    motResAmPT = 0
    motResAmRO = 0
    motResAmSK = 0
    motResAmSL = 0
    motResAmSV = 0

    # variables for EP motions for resolution - oral questions
    totMotResOralQst = 0
    motResOralQstBG = 0
    motResOralQstCS = 0
    motResOralQstDA = 0
    motResOralQstDE = 0
    motResOralQstEL = 0
    motResOralQstEN = 0
    motResOralQstES = 0
    motResOralQstET = 0
    motResOralQstFI = 0
    motResOralQstFR = 0
    motResOralQstGA = 0
    motResOralQstHR = 0
    motResOralQstHU = 0
    motResOralQstIT = 0
    motResOralQstLT = 0
    motResOralQstLV = 0
    motResOralQstMT = 0
    motResOralQstNL = 0
    motResOralQstPL = 0
    motResOralQstPT = 0
    motResOralQstRO = 0
    motResOralQstSK = 0
    motResOralQstSL = 0
    motResOralQstSV = 0

    # Variables for Joint motion for a resolution
    totJntMotRes = 0
    jntMotResBG = 0
    jntMotResCS = 0
    jntMotResDA = 0
    jntMotResDE = 0
    jntMotResEL = 0
    jntMotResEN = 0
    jntMotResES = 0
    jntMotResET = 0
    jntMotResFI = 0
    jntMotResFR = 0
    jntMotResGA = 0
    jntMotResHR = 0
    jntMotResHU = 0
    jntMotResIT = 0
    jntMotResLT = 0
    jntMotResLV = 0
    jntMotResMT = 0
    jntMotResNL = 0
    jntMotResPL = 0
    jntMotResPT = 0
    jntMotResRO = 0
    jntMotResSK = 0
    jntMotResSL = 0
    jntMotResSV = 0

    # variables for Joint motion for a resolution amendment
    totJntMotResAm = 0
    jntMotResAmBG = 0
    jntMotResAmCS = 0
    jntMotResAmDA = 0
    jntMotResAmDE = 0
    jntMotResAmEL = 0
    jntMotResAmEN = 0
    jntMotResAmES = 0
    jntMotResAmET = 0
    jntMotResAmFI = 0
    jntMotResAmFR = 0
    jntMotResAmGA = 0
    jntMotResAmHR = 0
    jntMotResAmHU = 0
    jntMotResAmIT = 0
    jntMotResAmLT = 0
    jntMotResAmLV = 0
    jntMotResAmMT = 0
    jntMotResAmNL = 0
    jntMotResAmPL = 0
    jntMotResAmPT = 0
    jntMotResAmRO = 0
    jntMotResAmSK = 0
    jntMotResAmSL = 0
    jntMotResAmSV = 0

    # Start reading files
    for file in os.listdir(r'' + readFolder):
        # Total parliamentary documents
        if ".pdf" in file:
            totalParlDocs += 1
        if ".pdf" in file and '-AM-' in file:
            totalAm += 1
        # Counting for files of type Reports
        if ".pdf" in file and 'A-' in file and '-AM-' not in file:
            totparlRep += 1
        if "_bg.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepBG += 1
        if "_cs.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepCS += 1
        if "_da.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepDA += 1
        if "_de.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepDE += 1
        if "_el.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepEL += 1
        if "_en.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepEN += 1
        if "_es.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepES += 1
        if "_et.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepET += 1
        if "_fi.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepFI += 1
        if "_fr.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepFR += 1
        if "_ga.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepGA += 1
        if "_hr.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepHR += 1
        if "_hu.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepHU += 1
        if "_it.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepIT += 1
        if "_lt.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepLT += 1
        if "_lv.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepLV += 1
        if "_mt.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepMT += 1
        if "_nl.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepNL += 1
        if "_pl.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepPL += 1
        if "_pt.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepPT += 1
        if "_ro.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepRO += 1
        if "_sk.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepSK += 1
        if "_sl.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepSL += 1
        if "_sv.pdf" in file and 'A-' in file and '-AM-' not in file:
            parlRepSV += 1

        # Counting for files of type Reports amendment
        if ".pdf" in file and 'A-' in file and '-AM-' in file:
            totparlDocAmRep += 1
        if "_bg.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepBG += 1
        if "_cs.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepCS += 1
        if "_da.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepDA += 1
        if "_de.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepDE += 1
        if "_el.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepEL += 1
        if "_en.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepEN += 1
        if "_es.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepES += 1
        if "_et.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepET += 1
        if "_fi.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepFI += 1
        if "_fr.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepFR += 1
        if "_ga.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepGA += 1
        if "_hr.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepHR += 1
        if "_hu.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepHU += 1
        if "_it.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepIT += 1
        if "_lt.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepLT += 1
        if "_lv.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepLV += 1
        if "_mt.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepMT += 1
        if "_nl.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepNL += 1
        if "_pl.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepPL += 1
        if "_pt.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepPT += 1
        if "_ro.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepRO += 1
        if "_sk.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepSK += 1
        if "_sl.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepSL += 1
        if "_sv.pdf" in file and 'A-' in file and '-AM-' in file:
            parlDocAmRepSV += 1

        # Counting for files of type Motion for a resolution
        if ".pdf" in file and 'B-' in file and '-AM-' not in file:
            totMotRes += 1
        if "_bg.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResBG += 1
        if "_cs.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResCS += 1
        if "_da.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResDA += 1
        if "_de.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResDE += 1
        if "_el.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResEL += 1
        if "_en.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResEN += 1
        if "_es.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResES += 1
        if "_et.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResET += 1
        if "_fi.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResFI += 1
        if "_fr.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResFR += 1
        if "_ga.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResGA += 1
        if "_hr.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResHR += 1
        if "_hu.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResHU += 1
        if "_it.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResIT += 1
        if "_lt.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResLT += 1
        if "_lv.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResLV += 1
        if "_mt.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResMT += 1
        if "_nl.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResNL += 1
        if "_pl.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResPL += 1
        if "_pt.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResPT += 1
        if "_ro.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResRO += 1
        if "_sk.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResSK += 1
        if "_sl.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResSL += 1
        if "_sv.pdf" in file and 'B-' in file and '-AM-' not in file:
            motResSV += 1

        # Counting for files of type Amendment for Motion for a resolution
        if ".pdf" in file and 'B-' in file and '-AM-' in file:
            totMotResAm += 1
        if "_bg.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmBG += 1
        if "_cs.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmCS += 1
        if "_da.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmDA += 1
        if "_de.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmDE += 1
        if "_el.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmEL += 1
        if "_en.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmEN += 1
        if "_es.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmES += 1
        if "_et.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmET += 1
        if "_fi.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmFI += 1
        if "_fr.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmFR += 1
        if "_ga.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmGA += 1
        if "_hr.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmHR += 1
        if "_hu.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmHU += 1
        if "_it.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmIT += 1
        if "_lt.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmLT += 1
        if "_lv.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmLV += 1
        if "_mt.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmMT += 1
        if "_nl.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmNL += 1
        if "_pl.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmPL += 1
        if "_pt.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmPT += 1
        if "_ro.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmRO += 1
        if "_sk.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmSK += 1
        if "_sl.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmSL += 1
        if "_sv.pdf" in file and 'B-' in file and '-AM-' in file:
            motResAmSV += 1

        # Counting for files of type EP motions for resolution - oral questions
        if ".pdf" in file and 'QOB-' in file and '-AM-' not in file:
            totMotResOralQst += 1
        if "_bg.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstBG += 1
        if "_cs.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstCS += 1
        if "_da.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstDA += 1
        if "_de.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstDE += 1
        if "_el.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstEL += 1
        if "_en.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstEN += 1
        if "_es.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstES += 1
        if "_et.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstET += 1
        if "_fi.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstFI += 1
        if "_fr.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstFR += 1
        if "_ga.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstGA += 1
        if "_hr.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstHR += 1
        if "_hu.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstHU += 1
        if "_it.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstIT += 1
        if "_lt.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstLT += 1
        if "_lv.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstLV += 1
        if "_mt.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstMT += 1
        if "_nl.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstNL += 1
        if "_pl.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstPL += 1
        if "_pt.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstPT += 1
        if "_ro.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstRO += 1
        if "_sk.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstSK += 1
        if "_sl.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstSL += 1
        if "_sv.pdf" in file and 'QOB-' in file and '-AM-' not in file:
            motResOralQstSV += 1

        # Counting for files of type Joint motion for a resolution
        if ".pdf" in file and 'RC-' in file and '-AM-' not in file:
            totJntMotRes += 1
        if "_bg.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResBG += 1
        if "_cs.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResCS += 1
        if "_da.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResDA += 1
        if "_de.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResDE += 1
        if "_el.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResEL += 1
        if "_en.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResEN += 1
        if "_es.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResES += 1
        if "_et.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResET += 1
        if "_fi.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResFI += 1
        if "_fr.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResFR += 1
        if "_ga.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResGA += 1
        if "_hr.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResHR += 1
        if "_hu.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResHU += 1
        if "_it.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResIT += 1
        if "_lt.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResLT += 1
        if "_lv.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResLV += 1
        if "_mt.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResMT += 1
        if "_nl.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResNL += 1
        if "_pl.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResPL += 1
        if "_pt.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResPT += 1
        if "_ro.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResRO += 1
        if "_sk.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResSK += 1
        if "_sl.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResSL += 1
        if "_sv.pdf" in file and 'RC-' in file and '-AM-' not in file:
            jntMotResSV += 1

        if ".pdf" in file and 'RC-' in file and '-AM-' in file:
            totJntMotResAm += 1
        if "_bg.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmBG += 1
        if "_cs.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmCS += 1
        if "_da.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmDA += 1
        if "_de.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmDE += 1
        if "_el.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmEL += 1
        if "_en.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmEN += 1
        if "_es.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmES += 1
        if "_et.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmET += 1
        if "_fi.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmFI += 1
        if "_fr.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmFR += 1
        if "_ga.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmGA += 1
        if "_hr.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmHR += 1
        if "_hu.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmHU += 1
        if "_it.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmIT += 1
        if "_lt.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmLT += 1
        if "_lv.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmLV += 1
        if "_mt.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmMT += 1
        if "_nl.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmNL += 1
        if "_pl.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmPL += 1
        if "_pt.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmPT += 1
        if "_ro.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmRO += 1
        if "_sk.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmSK += 1
        if "_sl.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmSL += 1
        if "_sv.pdf" in file and 'RC-' in file and '-AM-' in file:
            jntMotResAmSV += 1

    # If the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlParlDocpdf.txt'):
        with open(base_folder + '/stats/outputStsEurParlParlDocpdf.txt', 'w') as file:
            file.close()
    # start writing the file with the results from the counting from the different languages
    # first object to write reports
    with open(base_folder + '/stats/outputStsEurParlParlDocpdf.txt', 'w') as a:
        a.write('Number of EP plenary documents : {}'.format(totalParlDocs) + '\n\n')
        a.write('Number of EP plenary documents reports: {}'.format(totparlRep) + '\n')
        a.write('Number of EP plenary documents reports(Bulgarian): {}'.format(parlRepBG) + '\n')
        a.write('Number of EP plenary documents reports(Czech): {}'.format(parlRepCS) + '\n')
        a.write('Number of EP plenary documents reports(Danish): {}'.format(parlRepDA) + '\n')
        a.write('Number of EP plenary documents reports(German): {}'.format(parlRepDE) + '\n')
        a.write('Number of EP plenary documents reports(Greek): {}'.format(parlRepEL) + '\n')
        a.write('Number of EP plenary documents reports(English): {}'.format(parlRepEN) + '\n')
        a.write('Number of EP plenary documents reports(Spanish): {}'.format(parlRepES) + '\n')
        a.write('Number of EP plenary documents reports(Estonian): {}'.format(parlRepET) + '\n')
        a.write('Number of EP plenary documents reports(Finnish): {}'.format(parlRepFI) + '\n')
        a.write('Number of EP plenary documents reports(French): {}'.format(parlRepFR) + '\n')
        a.write('Number of EP plenary documents reports(Irish): {}'.format(parlRepGA) + '\n')
        a.write('Number of EP plenary documents reports(Croatian): {}'.format(parlRepHR) + '\n')
        a.write('Number of EP plenary documents reports(Hungarian): {}'.format(parlRepHU) + '\n')
        a.write('Number of EP plenary documents reports(Italian): {}'.format(parlRepIT) + '\n')
        a.write('Number of EP plenary documents reports(Lithuanian): {}'.format(parlRepLT) + '\n')
        a.write('Number of EP plenary documents reports(Latvian): {}'.format(parlRepLV) + '\n')
        a.write('Number of EP plenary documents reports(Maltese): {}'.format(parlRepMT) + '\n')
        a.write('Number of EP plenary documents reports(Dutch): {}'.format(parlRepNL) + '\n')
        a.write('Number of EP plenary documents reports(Polish): {}'.format(parlRepPL) + '\n')
        a.write('Number of EP plenary documents reports(Portuguese): {}'.format(parlRepPT) + '\n')
        a.write('Number of EP plenary documents reports(Romanian): {}'.format(parlRepRO) + '\n')
        a.write('Number of EP plenary documents reports(Slovak): {}'.format(parlRepSK) + '\n')
        a.write('Number of EP plenary documents reports(Slovenian): {}'.format(parlRepSL) + '\n')
        a.write('Number of EP plenary documents reports(Swedish): {}'.format(parlRepSV) + '\n\n')

        # object to write EP plenary documents reports amendments
        a.write('Number of EP plenary documents reports amendments: {}'.format(totparlDocAmRep) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Bulgarian): {}'.format(parlDocAmRepBG) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Czech): {}'.format(parlDocAmRepCS) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Danish): {}'.format(parlDocAmRepDA) + '\n')
        a.write('Number of EP plenary documents reports amendments in (German): {}'.format(parlDocAmRepDE) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Greek): {}'.format(parlDocAmRepEL) + '\n')
        a.write('Number of EP plenary documents reports amendments in (English): {}'.format(parlDocAmRepEN) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Spanish): {}'.format(parlDocAmRepES) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Estonian): {}'.format(parlDocAmRepET) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Finnish): {}'.format(parlDocAmRepFI) + '\n')
        a.write('Number of EP plenary documents reports amendments in (French): {}'.format(parlDocAmRepFR) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Irish): {}'.format(parlDocAmRepGA) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Croatian): {}'.format(parlDocAmRepHR) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Hungarian): {}'.format(parlDocAmRepHU) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Italian): {}'.format(parlDocAmRepIT) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Lithuanian): {}'.format(parlDocAmRepLT) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Latvian): {}'.format(parlDocAmRepLV) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Maltese): {}'.format(parlDocAmRepMT) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Dutch): {}'.format(parlDocAmRepNL) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Polish): {}'.format(parlDocAmRepPL) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Portuguese): {}'.format(parlDocAmRepPT) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Romanian): {}'.format(parlDocAmRepRO) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Slovak): {}'.format(parlDocAmRepSK) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Slovenian): {}'.format(parlDocAmRepSL) + '\n')
        a.write('Number of EP plenary documents reports amendments in (Swedish): {}'.format(parlDocAmRepSV) + '\n\n')

        # object to write EP plenary documents Motion for a resolution
        a.write('Number of EP plenary documents Motion for a resolution: {}'.format(totMotRes) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution  (Bulgarian): {}'.format(motResBG) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Czech): {}'.format(motResCS) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Danish): {}'.format(motResDA) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (German): {}'.format(motResDE) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Greek): {}'.format(motResEL) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (English): {}'.format(motResEN) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Spanish): {}'.format(motResES) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Estonian): {}'.format(motResET) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Finnish): {}'.format(motResFI) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (French): {}'.format(motResFR) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Irish): {}'.format(motResGA) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Croatian): {}'.format(motResHR) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution (Hungarian): {}'.format(motResHU) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Italian): {}'.format(motResIT) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution (Lithuanian): {}'.format(motResLT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Latvian): {}'.format(motResLV) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Maltese): {}'.format(motResMT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Dutch): {}'.format(motResNL) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Polish): {}'.format(motResPL) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution (Portuguese): {}'.format(motResPT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Romanian): {}'.format(motResRO) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution (Slovak): {}'.format(motResSK) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution (Slovenian): {}'.format(motResSL) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution (Swedish): {}'.format(motResSV) + '\n\n')

        # object to write plenary documents Motion for a resolution amendments
        a.write('Number of EP plenary documents Motion for a resolution amendments: {}'.format(totMotResAm) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Bulgarian): {}'.format(
                motResAmBG) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Czech): {}'.format(
            motResAmCS) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Danish): {}'.format(
            motResAmDA) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (German): {}'.format(
            motResAmDE) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Greek): {}'.format(
            motResAmEL) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (English): {}'.format(
            motResAmEN) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Spanish): {}'.format(
            motResAmES) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Estonian): {}'.format(
            motResAmET) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Finnish): {}'.format(
            motResAmFI) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (French): {}'.format(
            motResAmFR) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Irish): {}'.format(
            motResAmGA) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Croatian): {}'.format(
            motResAmHR) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Hungarian): {}'.format(
                motResAmHU) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Italian): {}'.format(
            motResAmIT) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Lithuanian): {}'.format(
                motResAmLT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Latvian): {}'.format(
            motResAmLV) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Maltese): {}'.format(
            motResAmMT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Dutch): {}'.format(
            motResAmNL) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Polish): {}'.format(
            motResAmPL) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Portuguese): {}'.format(
                motResAmPT) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Romanian): {}'.format(
            motResAmRO) + '\n')
        a.write('Number of EP plenary documents Motion for a resolution amendments in (Slovak): {}'.format(
            motResAmSK) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Slovenian): {}'.format(
                motResAmSL) + '\n')
        a.write(
            'Number of EP plenary documents Motion for a resolution amendments in (Swedish): {}'.format(
                motResAmSV) + '\n\n')

        # object to write plenary documents Motion for a resolution - oral questions
        a.write('Number of EP plenary documents Motions for resolution - oral questions: {}'.format(
            totMotResOralQst) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions  (Bulgarian): {}'.format(
            motResOralQstBG) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Czech): {}'.format(
            motResOralQstCS) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Danish): {}'.format(
            motResOralQstDA) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (German): {}'.format(
            motResOralQstDE) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Greek): {}'.format(
            motResOralQstEL) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (English): {}'.format(
            motResOralQstEN) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Spanish): {}'.format(
            motResOralQstES) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Estonian): {}'.format(
            motResOralQstET) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Finnish): {}'.format(
            motResOralQstFI) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (French): {}'.format(
            motResOralQstFR) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Irish): {}'.format(
            motResOralQstGA) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Croatian): {}'.format(
            motResOralQstHR) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Hungarian): {}'.format(
            motResOralQstHU) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Italian): {}'.format(
            motResOralQstIT) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Lithuanian): {}'.format(
            motResOralQstLT) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Latvian): {}'.format(
            motResOralQstLV) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Maltese): {}'.format(
            motResOralQstMT) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Dutch): {}'.format(
            motResOralQstNL) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Polish): {}'.format(
            motResOralQstPL) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Portuguese): {}'.format(
            motResOralQstPT) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Romanian): {}'.format(
            motResOralQstRO) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Slovak): {}'.format(
            motResOralQstSK) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Slovenian): {}'.format(
            motResOralQstSL) + '\n')
        a.write('Number of EP plenary documents Motions for resolution - oral questions (Swedish): {}'.format(
            motResOralQstSV) + '\n\n')

        # object to write EP plenary documents Joint Motion for a resolution
        a.write('Number of EP plenary documents Joint motion for a resolution: {}'.format(totJntMotRes) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution  (Bulgarian): {}'.format(
                jntMotResBG) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Czech): {}'.format(
                jntMotResCS) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Danish): {}'.format(
                jntMotResDA) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (German): {}'.format(
                jntMotResDE) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Greek): {}'.format(
                jntMotResEL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (English): {}'.format(
                jntMotResEN) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Spanish): {}'.format(
                jntMotResES) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Estonian): {}'.format(
                jntMotResET) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Finnish): {}'.format(
                jntMotResFI) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (French): {}'.format(
                jntMotResFR) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Irish): {}'.format(
                jntMotResGA) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Croatian): {}'.format(
                jntMotResHR) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Hungarian): {}'.format(
                jntMotResHU) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Italian): {}'.format(
                jntMotResIT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Lithuanian): {}'.format(
                jntMotResLT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Latvian): {}'.format(
                jntMotResLV) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Maltese): {}'.format(
                jntMotResMT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Dutch): {}'.format(
                jntMotResNL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Polish): {}'.format(
                jntMotResPL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Portuguese): {}'.format(
                jntMotResPT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Romanian): {}'.format(
                jntMotResRO) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Slovak): {}'.format(
                jntMotResSK) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Slovenian): {}'.format(
                jntMotResSL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution (Swedish): {}'.format(
                jntMotResSV) + '\n\n\n')

        # object to write EP plenary documents Joint Motion for a resolution amendment
        a.write('Number of EP plenary documents Joint motion for a resolution amendment: {}'.format(
            totJntMotResAm) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Bulgarian): {}'.format(
                jntMotResAmBG) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Czech): {}'.format(
                jntMotResAmCS) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Danish): {}'.format(
                jntMotResAmDA) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (German): {}'.format(
                jntMotResAmDE) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Greek): {}'.format(
                jntMotResAmEL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (English): {}'.format(
                jntMotResAmEN) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Spanish): {}'.format(
                jntMotResAmES) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Estonian): {}'.format(
                jntMotResAmET) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Finnish): {}'.format(
                jntMotResAmFI) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (French): {}'.format(
                jntMotResAmFR) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Irish): {}'.format(
                jntMotResAmGA) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Croatian): {}'.format(
                jntMotResAmHR) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Hungarian): {}'.format(
                jntMotResAmHU) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Italian): {}'.format(
                jntMotResAmIT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Lithuanian): {}'.format(
                jntMotResAmLT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in Latvian): {}'.format(
                jntMotResAmLV) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Maltese): {}'.format(
                jntMotResAmMT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Dutch): {}'.format(
                jntMotResAmNL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Polish): {}'.format(
                jntMotResAmPL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Portuguese): {}'.format(
                jntMotResAmPT) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Romanian): {}'.format(
                jntMotResAmRO) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Slovak): {}'.format(
                jntMotResAmSK) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Slovenian): {}'.format(
                jntMotResAmSL) + '\n')
        a.write(
            'Number of EP plenary documents Joint motion for a resolution amendment in (Swedish): {}'.format(
                jntMotResAmSV) + '\n\n\n')

        # object to write percentage of EP plenary documents reports
        a.write('percentage of EP plenary documents reports: {:.3%}'.format(totparlRep / totalParlDocs) + '\n')
        a.write('percentage of EP plenary documents reports BG: {:.3%}'.format(parlRepBG / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports CS: {:.3%}'.format(parlRepCS / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports DA: {:.3%}'.format(parlRepDA / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports DE: {:.3%}'.format(parlRepDE / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports EL: {:.3%}'.format(parlRepEL / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports EN: {:.3%}'.format(parlRepEN / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports ES: {:.3%}'.format(parlRepES / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports ET: {:.3%}'.format(parlRepET / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports FI: {:.3%}'.format(parlRepFI / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports FR: {:.3%}'.format(parlRepFR / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports GA: {:.3%}'.format(parlRepGA / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports HR: {:.3%}'.format(parlRepHR / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports HU: {:.3%}'.format(parlRepHU / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports IT: {:.3%}'.format(parlRepIT / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports LT: {:.3%}'.format(parlRepLT / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports LV: {:.3%}'.format(parlRepLV / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports MT: {:.3%}'.format(parlRepMT / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports NL: {:.3%}'.format(parlRepNL / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports PL: {:.3%}'.format(parlRepPL / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports PT: {:.3%}'.format(parlRepPT / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports RO: {:.3%}'.format(parlRepRO / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports SK: {:.3%}'.format(parlRepSK / totparlRep) + '\n')
        a.write('percentage of EP plenary documents reports SL: {:.3%}'.format(parlRepSL / totparlRep) + '\n')
        a.write(
            'percentage of EP plenary documents reports SV: {:.3%}'.format(parlRepSV / totparlRep) + '\n\n')

        # object to write percentage of EP plenary documents reports amendment
        a.write(
            'percentage of EP plenary documents reports amendment: {:.3%}'.format(
                totparlDocAmRep / totalParlDocs) + '\n')
        if totparlDocAmRep > 0:
            a.write('percentage of EP plenary documents reports amendment in BG: {:.3%}'.format(
                parlDocAmRepBG / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in CS: {:.3%}'.format(
                parlDocAmRepCS / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in DA: {:.3%}'.format(
                parlDocAmRepDA / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in DE: {:.3%}'.format(
                parlDocAmRepDE / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in EL: {:.3%}'.format(
                parlDocAmRepEL / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in EN: {:.3%}'.format(
                parlDocAmRepEN / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in ES: {:.3%}'.format(
                parlDocAmRepES / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in ET: {:.3%}'.format(
                parlDocAmRepET / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in FI: {:.3%}'.format(
                parlDocAmRepFI / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in FR: {:.3%}'.format(
                parlDocAmRepFR / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in GA: {:.3%}'.format(
                parlDocAmRepGA / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in HR: {:.3%}'.format(
                parlDocAmRepHR / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in HU: {:.3%}'.format(
                parlDocAmRepHU / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in IT: {:.3%}'.format(
                parlDocAmRepIT / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in LT: {:.3%}'.format(
                parlDocAmRepLT / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in LV: {:.3%}'.format(
                parlDocAmRepLV / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in MT: {:.3%}'.format(
                parlDocAmRepMT / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in NL: {:.3%}'.format(
                parlDocAmRepNL / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in PL: {:.3%}'.format(
                parlDocAmRepPL / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in PT: {:.3%}'.format(
                parlDocAmRepPT / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in RO: {:.3%}'.format(
                parlDocAmRepRO / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in SK: {:.3%}'.format(
                parlDocAmRepSK / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in SL: {:.3%}'.format(
                parlDocAmRepSL / totparlDocAmRep) + '\n')
            a.write('percentage of EP plenary documents reports amendment in SV: {:.3%}'.format(
                parlDocAmRepSV / totparlDocAmRep) + '\n\n')

        # object to write percentage of EP plenary documents Motion for a resolution
        a.write('percentage of EP plenary documents Motion for a resolution: {:.3%}'.format(
            totMotRes / totalParlDocs) + '\n')
        if totMotRes > 0:
            a.write('percentage of EP plenary documents Motion for a resolution BG: {:.3%}'.format(
                motResBG / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution CS: {:.3%}'.format(
                motResCS / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution DA: {:.3%}'.format(
                motResDA / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution DE: {:.3%}'.format(
                motResDE / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution EL: {:.3%}'.format(
                motResEL / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution EN: {:.3%}'.format(
                motResEN / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution ES: {:.3%}'.format(
                motResES / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution ET: {:.3%}'.format(
                motResET / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution FI: {:.3%}'.format(
                motResFI / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution FR: {:.3%}'.format(
                motResFR / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution GA: {:.3%}'.format(
                motResGA / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution HR: {:.3%}'.format(
                motResHR / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution HU: {:.3%}'.format(
                motResHU / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution IT: {:.3%}'.format(
                motResIT / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution LT: {:.3%}'.format(
                motResLT / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution LV: {:.3%}'.format(
                motResLV / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution MT: {:.3%}'.format(
                motResMT / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution NL: {:.3%}'.format(
                motResNL / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution PL: {:.3%}'.format(
                motResPL / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution PT: {:.3%}'.format(
                motResPT / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution RO: {:.3%}'.format(
                motResRO / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution SK: {:.3%}'.format(
                motResSK / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution SL: {:.3%}'.format(
                motResSL / totMotRes) + '\n')
            a.write('percentage of EP plenary documents Motion for a resolution SV: {:.3%}'.format(
                motResSV / totMotRes) + '\n\n')

        # object to write percentage of amendments of EP plenary documents Motion for a resolution
        a.write(
            'percentage of amendments of EP plenary documents Motion for a resolution: {:.3%}'.format(
                totMotResAm / totalParlDocs) + '\n')
        if totMotResAm > 0:
            a.write('percentage of amendments of EP plenary documents Motion for a resolution BG: {:.3%}'.format(
                motResAmBG / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution CS: {:.3%}'.format(
                motResAmCS / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution DA: {:.3%}'.format(
                motResAmDA / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution DE: {:.3%}'.format(
                motResAmDE / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution EL: {:.3%}'.format(
                motResAmEL / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution EN: {:.3%}'.format(
                motResAmEN / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution ES: {:.3%}'.format(
                motResAmES / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution ET: {:.3%}'.format(
                motResAmET / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution FI: {:.3%}'.format(
                motResAmFI / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution FR: {:.3%}'.format(
                motResAmFR / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution GA: {:.3%}'.format(
                motResAmGA / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution HR: {:.3%}'.format(
                motResAmHR / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution HU: {:.3%}'.format(
                motResAmHU / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution IT: {:.3%}'.format(
                motResAmIT / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution LT: {:.3%}'.format(
                motResAmLT / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution LV: {:.3%}'.format(
                motResAmLV / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution MT: {:.3%}'.format(
                motResAmMT / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution NL: {:.3%}'.format(
                motResAmNL / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution PL: {:.3%}'.format(
                motResAmPL / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution PT: {:.3%}'.format(
                motResAmPT / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution RO: {:.3%}'.format(
                motResAmRO / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution SK: {:.3%}'.format(
                motResAmSK / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution SL: {:.3%}'.format(
                motResAmSL / totMotResAm) + '\n')
            a.write('percentage of amendments of EP plenary documents Motion for a resolution SV: {:.3%}'.format(
                motResAmSV / totMotResAm) + '\n\n')

        # object to write percentage of amendments of EP plenary documents Motion for a resolution - oral questions
        a.write('percentage of EP plenary documents Motions for resolution - oral questions: {:.3%}'.format(
            totMotResOralQst / totalParlDocs) + '\n')

        if totMotResOralQst > 0:
            a.write('percentage of EP plenary documents Motions for resolution - oral questions BG: {:.3%}'.format(
                motResOralQstBG / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions CS: {:.3%}'.format(
                motResOralQstCS / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions DA: {:.3%}'.format(
                motResOralQstDA / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions DE: {:.3%}'.format(
                motResOralQstDE / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions EL: {:.3%}'.format(
                motResOralQstEL / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions EN: {:.3%}'.format(
                motResOralQstEN / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions ES: {:.3%}'.format(
                motResOralQstES / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions ET: {:.3%}'.format(
                motResOralQstET / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions FI: {:.3%}'.format(
                motResOralQstFI / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions FR: {:.3%}'.format(
                motResOralQstFR / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions GA: {:.3%}'.format(
                motResOralQstGA / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions HR: {:.3%}'.format(
                motResOralQstHR / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions HU: {:.3%}'.format(
                motResOralQstHU / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions IT: {:.3%}'.format(
                motResOralQstIT / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions LT: {:.3%}'.format(
                motResOralQstLT / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions LV: {:.3%}'.format(
                motResOralQstLV / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions MT: {:.3%}'.format(
                motResOralQstMT / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions NL: {:.3%}'.format(
                motResOralQstNL / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions PL: {:.3%}'.format(
                motResOralQstPL / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions PT: {:.3%}'.format(
                motResOralQstPT / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions RO: {:.3%}'.format(
                motResOralQstRO / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions SK: {:.3%}'.format(
                motResOralQstSK / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions SL: {:.3%}'.format(
                motResOralQstSL / totMotResOralQst) + '\n')
            a.write('percentage of EP plenary documents Motions for resolution - oral questions SV: {:.3%}'.format(
                motResOralQstSV / totMotResOralQst) + '\n\n')

        # object to write percentage of EP plenary documents Joint motion for a resolution
        a.write('percentage of EP plenary documents Joint motion for a resolution: {:.3%}'.format(
            totJntMotRes / totalParlDocs) + '\n')

        if totJntMotRes > 0:
            a.write('percentage of EP plenary documents Joint motion for a resolution BG: {:.3%}'.format(
                jntMotResBG / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution CS: {:.3%}'.format(
                jntMotResCS / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution DA: {:.3%}'.format(
                jntMotResDA / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution DE: {:.3%}'.format(
                jntMotResDE / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution EL: {:.3%}'.format(
                jntMotResEL / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution EN: {:.3%}'.format(
                jntMotResEN / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution ES: {:.3%}'.format(
                jntMotResES / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution ET: {:.3%}'.format(
                jntMotResET / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution FI: {:.3%}'.format(
                jntMotResFI / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution FR: {:.3%}'.format(
                jntMotResFR / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution GA: {:.3%}'.format(
                jntMotResGA / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution HR: {:.3%}'.format(
                jntMotResHR / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution HU: {:.3%}'.format(
                jntMotResHU / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution IT: {:.3%}'.format(
                jntMotResIT / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution LT: {:.3%}'.format(
                jntMotResLT / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution LV: {:.3%}'.format(
                jntMotResLV / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution MT: {:.3%}'.format(
                jntMotResMT / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution NL: {:.3%}'.format(
                jntMotResNL / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution PL: {:.3%}'.format(
                jntMotResPL / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution PT: {:.3%}'.format(
                jntMotResPT / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution RO: {:.3%}'.format(
                jntMotResRO / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution SK: {:.3%}'.format(
                jntMotResSK / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution SL: {:.3%}'.format(
                jntMotResSL / totJntMotRes) + '\n')
            a.write('percentage of EP plenary documents Joint motion for a resolution SV: {:.3%}'.format(
                jntMotResSV / totJntMotRes) + '\n\n')

        # object to write percentage of amendments EP plenary documents Joint motion for a resolution
        a.write('percentage of amendments EP plenary documents Joint motion for a resolution: {:.3%}'.format(
            totJntMotResAm / totalParlDocs) + '\n')
        if totJntMotResAm > 0:
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution BG: {:.3%}'.format(
                jntMotResAmBG / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution CS: {:.3%}'.format(
                jntMotResAmCS / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution DA: {:.3%}'.format(
                jntMotResAmDA / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution DE: {:.3%}'.format(
                jntMotResAmDE / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution EL: {:.3%}'.format(
                jntMotResAmEL / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution EN: {:.3%}'.format(
                jntMotResAmEN / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution ES: {:.3%}'.format(
                jntMotResAmES / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution ET: {:.3%}'.format(
                jntMotResAmET / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution FI: {:.3%}'.format(
                jntMotResAmFI / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution FR: {:.3%}'.format(
                jntMotResAmFR / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution GA: {:.3%}'.format(
                jntMotResAmGA / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution HR: {:.3%}'.format(
                jntMotResAmHR / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution HU: {:.3%}'.format(
                jntMotResAmHU / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution IT: {:.3%}'.format(
                jntMotResAmIT / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution LT: {:.3%}'.format(
                jntMotResAmLT / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution LV: {:.3%}'.format(
                jntMotResAmLV / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution MT: {:.3%}'.format(
                jntMotResAmMT / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution NL: {:.3%}'.format(
                jntMotResAmNL / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution PL: {:.3%}'.format(
                jntMotResAmPL / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution PT: {:.3%}'.format(
                jntMotResAmPT / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution RO: {:.3%}'.format(
                jntMotResAmRO / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution SK: {:.3%}'.format(
                jntMotResAmSK / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution SL: {:.3%}'.format(
                jntMotResAmSL / totJntMotResAm) + '\n')
            a.write('percentage of amendments EP plenary documents Joint motion for a resolution SV: {:.3%}'.format(
                jntMotResAmSV / totJntMotResAm) + '\n')
