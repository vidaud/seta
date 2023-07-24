import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime

# the following script gives some statistics regarding the different types of items

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
externalDir = 'D:/SeTA/'
startDir = externalDir
# assignment of folder where to read the files
pathFolder = startDir + 'EURPARL/'
directory = os.listdir(pathFolder)
print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")
date_time = now.strftime("%Y%m%d%H%M%S")

optionToRun = input('choose what you want to do: \n'
                    'statistics of adopted-texts PDF files (A) \n'
                    'statistics of plenary-documents PDF files (D)\n'
                    'statistics of parliamentary-questions PDF files (Q)  \n'
                    'statistics of plenary-session PDF files (S):  \t')

base_folder = startDir + 'EURPARL/'
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

# if the option is statistics of adopted-texts PDF files
if optionToRun == 'A':
    # setting the  readable folder
    readFolder = base_folder + 'downloadPdfFiles/parlAdopTxtPDF/'
    if not os.path.exists(readFolder):
        print('Readable folder does not exist {}, verify'.format(readFolder))
        exit()

# if the option is statistics of plenary-documents PDF files
if optionToRun == 'D':
    # setting the readable folder
    readFolder = base_folder + 'downloadPdfFiles/parlDocsPdf/'
    if not os.path.exists(readFolder):
        print('Readable folder does not exist {}, verify'.format(readFolder))
        exit()
# if the option is statistics of parliamentary-questions PDF files
if optionToRun == 'Q':
    # setting the readable folder
    readFolder = base_folder + 'downloadPdfFiles/parlQuestionsPdf/'
    if not os.path.exists(readFolder):
        print('Readable folder does not exist {}, verify'.format(readFolder))
        exit()
# if the option is statistics of plenary-session PDF files
if optionToRun == 'S':
    readFolder = base_folder + 'downloadPdfFiles/parlSessionsPdf/'
    if not os.path.exists(readFolder):
        print('Readable folder does not exist {}, verify'.format(readFolder))
        exit()


# the following function counts all the adopted-texts PDF files in the different languages, gives some percentage
# and write it to a txt file
def countingFilesTypesA(readFolder):
    totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))
    logger.info('Files with pdf ext {}:'.format(totalFiles))

    # reading all adopted-texts pdf files
    adoptedTxt = len(glob.glob1(readFolder, "TA*.pdf"))

    # reading adopted-texts pdf files of different languages
    adoptedTxt_BG = len(glob.glob1(readFolder, "TA*_bg.pdf"))
    adoptedTxt_CS = len(glob.glob1(readFolder, "TA*_cs.pdf"))
    adoptedTxt_DA = len(glob.glob1(readFolder, "TA*_da.pdf"))
    adoptedTxt_DE = len(glob.glob1(readFolder, "TA*_de.pdf"))
    adoptedTxt_EL = len(glob.glob1(readFolder, "TA*_el.pdf"))
    adoptedTxt_EN = len(glob.glob1(readFolder, "TA*_en.pdf"))
    adoptedTxt_ES = len(glob.glob1(readFolder, "TA*_es.pdf"))
    adoptedTxt_ET = len(glob.glob1(readFolder, "TA*_et.pdf"))
    adoptedTxt_FI = len(glob.glob1(readFolder, "TA*_fi.pdf"))
    adoptedTxt_FR = len(glob.glob1(readFolder, "TA*_fr.pdf"))
    adoptedTxt_GA = len(glob.glob1(readFolder, "TA*_ga.pdf"))
    adoptedTxt_HR = len(glob.glob1(readFolder, "TA*_hr.pdf"))
    adoptedTxt_HU = len(glob.glob1(readFolder, "TA*_hu.pdf"))
    adoptedTxt_IT = len(glob.glob1(readFolder, "TA*_it.pdf"))
    adoptedTxt_LT = len(glob.glob1(readFolder, "TA*_lt.pdf"))
    adoptedTxt_LV = len(glob.glob1(readFolder, "TA*_lv.pdf"))
    adoptedTxt_MT = len(glob.glob1(readFolder, "TA*_mt.pdf"))
    adoptedTxt_NL = len(glob.glob1(readFolder, "TA*_nl.pdf"))
    adoptedTxt_PL = len(glob.glob1(readFolder, "TA*_pl.pdf"))
    adoptedTxt_PT = len(glob.glob1(readFolder, "TA*_pt.pdf"))
    adoptedTxt_RO = len(glob.glob1(readFolder, "TA*_ro.pdf"))
    adoptedTxt_SK = len(glob.glob1(readFolder, "TA*_sk.pdf"))
    adoptedTxt_SL = len(glob.glob1(readFolder, "TA*_sl.pdf"))
    adoptedTxt_SV = len(glob.glob1(readFolder, "TA*_sv.pdf"))

    # print to the console the results
    logger.info('Number of EP Adopted text: {}'.format(adoptedTxt))
    logger.info('Number of EP Adopted text(Bulgarian): {}'.format(adoptedTxt_BG))
    logger.info('Number of EP Adopted text(Czech): {}'.format(adoptedTxt_CS))
    logger.info('Number of EP Adopted text(Danish): {}'.format(adoptedTxt_DA))
    logger.info('Number of EP Adopted text(German): {}'.format(adoptedTxt_DE))
    logger.info('Number of EP Adopted text(Greek): {}'.format(adoptedTxt_EL))
    logger.info('Number of EP Adopted text(English): {}'.format(adoptedTxt_EN))
    logger.info('Number of EP Adopted text(Spanish): {}'.format(adoptedTxt_ES))
    logger.info('Number of EP Adopted text(Estonian): {}'.format(adoptedTxt_ET))
    logger.info('Number of EP Adopted text(Finnish): {}'.format(adoptedTxt_FI))
    logger.info('Number of EP Adopted text(French): {}'.format(adoptedTxt_FR))
    logger.info('Number of EP Adopted text(Irish): {}'.format(adoptedTxt_GA))
    logger.info('Number of EP Adopted text(Croatian): {}'.format(adoptedTxt_HR))
    logger.info('Number of EP Adopted text(Hungarian): {}'.format(adoptedTxt_HU))
    logger.info('Number of EP Adopted text(Italian): {}'.format(adoptedTxt_IT))
    logger.info('Number of EP Adopted text(Lithuanian): {}'.format(adoptedTxt_LT))
    logger.info('Number of EP Adopted text(Latvian): {}'.format(adoptedTxt_LV))
    logger.info('Number of EP Adopted text(Maltese): {}'.format(adoptedTxt_MT))
    logger.info('Number of EP Adopted text(Dutch): {}'.format(adoptedTxt_NL))
    logger.info('Number of EP Adopted text(Polish): {}'.format(adoptedTxt_PL))
    logger.info('Number of EP Adopted text(Portuguese): {}'.format(adoptedTxt_PT))
    logger.info('Number of EP Adopted text(Romanian): {}'.format(adoptedTxt_RO))
    logger.info('Number of EP Adopted text(Slovak): {}'.format(adoptedTxt_SK))
    logger.info('Number of EP Adopted text(Slovenian): {}'.format(adoptedTxt_SL))
    logger.info('Number of EP Adopted text(Swedish): {}'.format(adoptedTxt_SV))

    # print to the console the results stats file, if the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputLstEurParlpdfAdopTxt.txt'):
        with open(base_folder + '/stats/outputLstEurParlpdfAdopTxt.txt', 'w') as file:
            file.close()

    # it starts writing the file
    with open(base_folder + '/stats/outputLstEurParlpdfAdopTxt.txt', 'w') as a:

        totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))
        a.write('Files with pdf ext {}:'.format(totalFiles) + '\n\n')

        # writing the number of files, the total and the different languages
        a.write('Number of EP Adopted text: {}'.format(adoptedTxt) + '\n\n')

        a.write('Number of EP Adopted text BG: {}'.format(adoptedTxt_BG) + '\n')
        a.write('Number of EP Adopted text CS: {}'.format(adoptedTxt_CS) + '\n')
        a.write('Number of EP Adopted text DA: {}'.format(adoptedTxt_DA) + '\n')
        a.write('Number of EP Adopted text DE: {}'.format(adoptedTxt_DE) + '\n')
        a.write('Number of EP Adopted text EL: {}'.format(adoptedTxt_EL) + '\n')
        a.write('Number of EP Adopted text EN: {}'.format(adoptedTxt_EN) + '\n')
        a.write('Number of EP Adopted text ES: {}'.format(adoptedTxt_ES) + '\n')
        a.write('Number of EP Adopted text ET: {}'.format(adoptedTxt_ET) + '\n')
        a.write('Number of EP Adopted text FI: {}'.format(adoptedTxt_FI) + '\n')
        a.write('Number of EP Adopted text FR: {}'.format(adoptedTxt_FR) + '\n')
        a.write('Number of EP Adopted text GA: {}'.format(adoptedTxt_GA) + '\n')
        a.write('Number of EP Adopted text HR: {}'.format(adoptedTxt_HR) + '\n')
        a.write('Number of EP Adopted text HU: {}'.format(adoptedTxt_HU) + '\n')
        a.write('Number of EP Adopted text IT: {}'.format(adoptedTxt_IT) + '\n')
        a.write('Number of EP Adopted text LT: {}'.format(adoptedTxt_LT) + '\n')
        a.write('Number of EP Adopted text LV: {}'.format(adoptedTxt_LV) + '\n')
        a.write('Number of EP Adopted text MT: {}'.format(adoptedTxt_MT) + '\n')
        a.write('Number of EP Adopted text NL: {}'.format(adoptedTxt_NL) + '\n')
        a.write('Number of EP Adopted text PL: {}'.format(adoptedTxt_PL) + '\n')
        a.write('Number of EP Adopted text PT: {}'.format(adoptedTxt_PT) + '\n')
        a.write('Number of EP Adopted text RO: {}'.format(adoptedTxt_RO) + '\n')
        a.write('Number of EP Adopted text SK: {}'.format(adoptedTxt_SK) + '\n')
        a.write('Number of EP Adopted text SL: {}'.format(adoptedTxt_SL) + '\n')
        a.write('Number of EP Adopted text SV: {}'.format(adoptedTxt_SV) + '\n\n')

        # writing the percentages of the different languages documents regarding the total documents
        a.write('percentage Number of EP Adopted text BG:{:.3%}'.format(adoptedTxt_BG / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text CS:{:.3%}'.format(adoptedTxt_CS / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text DA:{:.3%}'.format(adoptedTxt_DA / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text DE:{:.3%}'.format(adoptedTxt_DE / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text EL:{:.3%}'.format(adoptedTxt_EL / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text EN:{:.3%}'.format(adoptedTxt_EN / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text ES:{:.3%}'.format(adoptedTxt_ES / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text ET:{:.3%}'.format(adoptedTxt_ET / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text FI:{:.3%}'.format(adoptedTxt_FI / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text FR:{:.3%}'.format(adoptedTxt_FR / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text GA:{:.3%}'.format(adoptedTxt_GA / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text HR:{:.3%}'.format(adoptedTxt_HR / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text HU:{:.3%}'.format(adoptedTxt_HU / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text IT:{:.3%}'.format(adoptedTxt_IT / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text LT:{:.3%}'.format(adoptedTxt_LT / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text LV:{:.3%}'.format(adoptedTxt_LV / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text MT:{:.3%}'.format(adoptedTxt_MT / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text NL:{:.3%}'.format(adoptedTxt_NL / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text PL:{:.3%}'.format(adoptedTxt_PL / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text PT:{:.3%}'.format(adoptedTxt_PT / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text RO:{:.3%}'.format(adoptedTxt_RO / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text SK:{:.3%}'.format(adoptedTxt_SK / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text SL:{:.3%}'.format(adoptedTxt_SL / adoptedTxt) + '\n')
        a.write('percentage Number of EP Adopted text SV:{:.3%}'.format(adoptedTxt_SV / adoptedTxt) + '\n')


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

    # Looking for files of type Reports
    for file in os.listdir(r'' + readFolder):
        # Total parliamentary documents
        if ".pdf" in file:
            totalParlDocs += 1
        if ".pdf" in file and '-AM-' in file:
            totalAm += 1
        # Reports
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

        # Looking for files of type Reports amendment
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

        # Looking for files of type Motion for a resolution
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

        # Looking for files of type Amendment for Motion for a resolution
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

        # Looking for files of type EP motions for resolution - oral questions
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

        # Looking for files of type Joint motion for a resolution
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

    # print to the console the results stats file, if the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlParlDocpdf.txt'):
        with open(base_folder + '/stats/outputStsEurParlParlDocpdf.txt', 'w') as file:
            file.close()
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

        a.write(
            'percentage of EP plenary documents reports amendment: {:.3%}'.format(
                totparlDocAmRep / totalParlDocs) + '\n')
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

        a.write('percentage of EP plenary documents Motion for a resolution: {:.3%}'.format(
            totMotRes / totalParlDocs) + '\n')
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

        a.write(
            'percentage of amendments of EP plenary documents Motion for a resolution: {:.3%}'.format(
                totMotResAm / totalParlDocs) + '\n')
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

        a.write('percentage of EP plenary documents Motions for resolution - oral questions: {:.3%}'.format(
            totMotResOralQst / totalParlDocs) + '\n')
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

        a.write('percentage of EP plenary documents Joint motion for a resolution: {:.3%}'.format(
            totJntMotRes / totalParlDocs) + '\n')
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

        a.write('percentage of amendments EP plenary documents Joint motion for a resolution: {:.3%}'.format(
            totJntMotResAm / totalParlDocs) + '\n')
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


def countingFilesTypesQ(readFolder):
    # count the numer of file that have the extension pdf
    countQst = 0
    countAsw = 0
    print('read folder {}'.format(readFolder))

    # Questions for oral answer
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

    # Answers for oral answer
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

    # Questions for Question Time asked during the period set aside for questions during plenary sittings
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

    # Answer for Question Time asked during the period set aside during plenary sittings
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

    # Written questions with a request for a written answer
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

    # Answer for written questions with a request for a written answer
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

    for file in os.listdir(r'' + readFolder):
        # print(type(file))
        if ".pdf" in file and 'ASW' not in file:
            countQst += 1
        if '.pdf' in file and 'ASW' in file:
            countAsw += 1
        # Questions for oral answer
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

        # Answers for oral answer
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

        # Questions for Question Time asked during the period set aside for questions during plenary sittings
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

        # Answer for Question Time asked during the period set aside during plenary sittings
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

        # Written questions with a request for a written answer
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

        # Answer for written questions with a request for a written answer
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

    # print to the console the results stats file, if the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlParlQstpdf.txt'):
        with open(base_folder + '/stats/outputStsEurParlParlQstpdf.txt', 'w') as file:
            file.close()
    with open(base_folder + '/stats/outputStsEurParlParlQstpdf.txt', 'w') as a:

        a.write('Total files with pdf ext: {}'.format(totalFiles) + '\n')
        a.write('Number of questions:  {}'.format(countQst) + '\n')
        a.write('Number of answers:  {}'.format(countAsw) + '\n\n')

        # Questions for oral answer
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

        # Oral Answers for Questions
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

        # Questions for Question Time asked during the period set aside for questions during plenary sittings
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

        # Answer for Question Time asked during the period set aside for questions during plenary sittings
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

        # Written questions with a request for a written answer
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

        # Number of Answers for written questions with a request for a written answer
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

        # percentage of Questions for oral answer dealt with during plenary sittings
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
        # percentage of Answers for Oral Questions
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

        # percentage of Questions for Question Time asked during the period
        a.write(
            'percentage of Questions for Question Time asked during the period: {:.3%}'.format(
                qstTimeAnsw / countQst) + '\n')
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
        # percentage of Answer for Questions Time asked during the period
        a.write(
            'percentage of Answer for Questions Time asked during the period: {:.3%}'.format(
                answQstTime / countAsw) + '\n')

        # percentage of Written questions with a request for a written answer
        a.write('percentage of Written questions with a request for a written answer : {:.3%}'.format(
            wrtQstReqAnsw / countQst) + '\n')
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

        #   percentage of written answer for Written questions with a request
        a.write('percentage of written answer for Written questions with a request : {:.3%}'.format(
            answWrtQstReq / countAsw) + '\n')


def countingFilesTypesS(readFolder):
    # assignment of folder where to read the files
    # readFolder = base_folder + '/downloadPdfFiles/parlSessionsPdf'

    # count the numer of file that have the extension pdf
    totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))
    logger.info('Files with pdf ext {}:'.format(totalFiles))

    verbatimCounter = len(glob.glob1(readFolder, "CRE*.pdf"))

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

    # print to the console the results stats file, if the folder and the file did not exist they are created
    if not os.path.exists(base_folder + '/stats'):
        os.makedirs(base_folder + '/stats')
    if not os.path.exists(base_folder + '/stats/outputStsEurParlSessPdf.txt'):
        with open(base_folder + '/stats/output_lst_EurParl_pdf_file.txt', 'w') as file:
            file.close()
    with open(base_folder + '/stats/output_lst_EurParl_pdf_file.txt', 'w') as a:
        a.write('Total files count {}:'.format(totalFiles) + '\n\n')

        a.write('Number of EP plenary sitting verbatim report of proceedings: {}'.format(verbatimCounter) + '\n\n')

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

        a.write('Number of EP plenary sitting minutes: {}'.format(minutesCounter) + '\n')
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


# launch of the script
def main():
    # Here below the execution of the different functions to
    if optionToRun == 'A':
        countingFilesTypesA(readFolder)
    if optionToRun == 'D':
        countingFilesTypesD(readFolder)
    if optionToRun == 'Q':
        countingFilesTypesQ(readFolder)
    if optionToRun == 'S':
        countingFilesTypesS(readFolder)


if __name__ != '__main__':
    pass
else:
    main()
