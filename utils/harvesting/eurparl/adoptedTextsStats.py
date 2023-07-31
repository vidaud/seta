import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime

# the following function counts all the adopted-texts PDF files in the different languages, gives some percentage
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


# the following function counts all the adopted-texts PDF files in the different languages, gives some percentage
# and write it to a txt file
def countingFilesTypesA(readFolder):
    totalFiles = len(fnmatch.filter(os.listdir(readFolder), '*.pdf'))

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





