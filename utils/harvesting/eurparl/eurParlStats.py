import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime
from adoptedTextsStats import countingFilesTypesA
from plenaryDocumentsStats import countingFilesTypesD
from parliamentaryQuestStats import countingFilesTypesQ
from plenarySessionStats import countingFilesTypesS

# the following script gives some statistics regarding the different types of items

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")
date_time = now.strftime("%Y%m%d%H%M%S")

optionToRun = input('choose what you want to do: \n'
                    'statistics of adopted-texts PDF files (A) \n'
                    'statistics of plenary-documents PDF files (D)\n'
                    'statistics of parliamentary-questions PDF files (Q)  \n'
                    'statistics of plenary-session PDF files (S):  \n')

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

# launch of the script
def main():
    # Here below the execution of the different functions to
    print('Reading folder: '+readFolder)
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
