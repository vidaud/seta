import logging
import os
import time
from datetime import datetime
from getpass import getpass
import glob
import rdflib
import requests
from testProxy import is_good_proxy

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
externalDir = 'D:/SeTA/'
os.chdir('D:')
startDir = externalDir
pathFolder = startDir + 'EURPARL/'
directory = os.listdir(pathFolder)
print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

# declaration of input variables to run the script
username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')

optionToRun = input('choose what you want to do: \n'
                    'download adopted-texts PDF files (A) \n'
                    'download plenary-documents PDF files (D)\n'
                    'download parliamentary-questions PDF files (Q)\n'
                    'download plenary-session PDF files (S):  \t')

base_folder = startDir + 'EURPARL/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

loggingFolder = base_folder + 'logs/logDownloadPdf'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

date_time = now.strftime("%Y%m%d%H%M%S")

if optionToRun == 'A':
    # setting the dest of log folder for adopted-texts PDF
    loggingFolder = base_folder + 'logs/logparlAdopTxtPDFFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'D':
    # setting the dest of log folder for plenary-documents
    loggingFolder = base_folder + 'logs/logDocsPDFFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'Q':
    # setting the dest of log folder for parliamentary-questions
    loggingFolder = base_folder + 'logs/logQuestionsPDFFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'S':
    # setting the dest of log folder for plenary-session
    loggingFolder = base_folder + 'logs/logSessionsPDFFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if not os.path.exists(loggingFolder + '/failedPdf.txt'):
    with open(loggingFolder + "/failedPdf.txt", "w") as fileFailed:
        fileFailed.close()

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/log" + date_time + ".txt")
logger = logging.getLogger()

# assignment of folder where to save the files, if it does not exist then is created
destFolder = base_folder + 'downloadPdfFiles'
if not os.path.exists(destFolder):
    os.makedirs(destFolder)

# assignment of folder where to read the files
pathFolder = externalDir + 'EURPARL/downloadFiles/'
# changing the current folder to the declared path folder destination
os.chdir(pathFolder)

if optionToRun == 'A':
    pathFolder = base_folder + 'downloadFiles/parlAdopTxtFiles/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the xml elements does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadPDFfiles/parlAdopTxtPDF/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

if optionToRun == 'D':
    pathFolder = base_folder + 'downloadFiles/parl_docsFiles/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the xml elements does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadPDFfiles/parlDocsPdf/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

if optionToRun == 'M':
    pathFolder = base_folder + 'downloadFiles/parlMeetFiles/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the xml elements does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadPDFfiles/parlMeetPdf/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

if optionToRun == 'Q':
    pathFolder = base_folder + 'downloadFiles/parl_questionsFiles/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadPDFfiles/parlQuestionsPdf/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

if optionToRun == 'S':
    pathFolder = base_folder + 'downloadFiles/parlSessionsFiles/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadPDFfiles/parlSessionsPdf/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# changing the current folder to the declared path folder destination
os.chdir(pathFolder)


def search_str(file_path, word):
    with open(file_path, 'r') as f:
        # read all content of a file
        content = f.read()
        # check if string present in a file
        if word in content:
            return True
        else:
            return False


# the following function reads the single xml file gathered through the URL call made in the script
# "eurparlReadJsonResultPages" and from the info of the results download the PDF related to the xml file

def download_pdf_files(optionToRun, xmlFile):
    print('filename {}'.format(xmlFile))
    graph = rdflib.Graph()
    graph.parse(xmlFile)
    output = []
    for s in graph:
        if '.pdf' in s[2]:
            try:
                print('link\t {}\n'.format(s[2]))
                urlPDF = s[2]
                # starting the download
                print('urlPDF {}'.format(urlPDF))
                fileName = str(urlPDF.split('/')[6]).strip()
                print('filename {}'.format(fileName))
                if optionToRun == 'S':
                    if 'OJ-' in urlPDF and '.pdf' in urlPDF:
                        typeFileName = fileName.partition('OJ-')[2]
                        logger.info('filename {}'.format(fileName))
                        logger.info('typeFileName {}'.format(typeFileName))
                        logger.info('filepath {}'.format(downloadFolder + typeFileName))
                        if not glob.glob(downloadFolder + typeFileName):
                            if '-OFF' in urlPDF and '.pdf' in urlPDF:
                                fileToSearch = str(fileName).replace('-OFF','')
                                print('filetosearch {}'.format(fileToSearch))
                                if glob.glob(downloadFolder + fileToSearch):
                                    fileList = glob.glob(downloadFolder + fileToSearch)
                                    print('filelist {}'.format(fileList))
                                    for filePath in fileList:
                                        # try:
                                            print('found something already there')
                                            os.remove(filePath)
                                            # exit()
                                        # except:
                                        #     print("Error while deleting file : ", filePath)
                                # check if the file is the version 'ADOPTED'(FNL-OFF) or 'FINAL' (FNL)
                                # for the minutes and part-session agenda
                                file_exists = os.path.exists(downloadFolder + fileName)
                                if not file_exists:

                                    headers = {
                                        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.8)"
                                                      " Gecko/20100722 Firefox/3.6.8 GTB7.1 (.NET CLR 3.5.30729)"}
                                    s = requests.Session()
                                    s.proxies = {
                                        "https": "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"}

                                    r = s.get(urlPDF)
                                    print(f'Status Code: {r.status_code}')
                                    chunk_size = 2000

                                    with open(downloadFolder + fileName, 'wb') as fd:
                                        for chunk in r.iter_content(chunk_size):
                                            fd.write(chunk)
                                    time.sleep(2)
                                else:
                                    logger.info('The file is already downloaded {}'.format(downloadFolder + fileName))
                            elif '-FNL' in urlPDF and '.pdf' in urlPDF:
                                typeEndFileName = fileName.rpartition('FNL')[0]
                                logger.info('filename {}'.format(typeEndFileName))
                                logger.info('filepath {}'.format(downloadFolder + typeEndFileName + 'FNL*.pdf'))
                                if not glob.glob(downloadFolder + typeEndFileName + 'FNL*.pdf'):
                                    logger.info('file does not exists {}'.format(fileName))
                                    headers = {
                                        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.8) "
                                                      "Gecko/20100722 Firefox/3.6.8 GTB7.1 (.NET CLR 3.5.30729)"}
                                    s = requests.Session()
                                    s.proxies = {
                                        "https": "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"}

                                    r = s.get(urlPDF)
                                    print(f'Status Code: {r.status_code}')
                                    chunk_size = 2000

                                    with open(downloadFolder + fileName, 'wb') as fd:
                                        for chunk in r.iter_content(chunk_size):
                                            fd.write(chunk)
                                    time.sleep(2)
                                else:
                                    logger.info('The file is already downloaded {}'.format(downloadFolder + fileName))
                        else:
                            logger.info('The file is already downloaded {}'.format(downloadFolder + fileName))

                    elif 'CRE' in urlPDF and 'REV' in urlPDF and '.pdf' in urlPDF:
                        # check if is an EP plenary sitting verbatim report of proceedings
                        file_exists = os.path.exists(downloadFolder + fileName)
                        if not file_exists:
                            headers = {
                                "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.8) "
                                              "Gecko/20100722 Firefox/3.6.8 GTB7.1 ( "".NET CLR 3.5.30729)"}
                            s = requests.Session()
                            s.proxies = {"https": "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"}

                            r = s.get(urlPDF)
                            print(f'Status Code: {r.status_code}')
                            chunk_size = 2000

                            with open(downloadFolder + '/' + fileName, 'wb') as fd:
                                for chunk in r.iter_content(chunk_size):
                                    fd.write(chunk)
                            time.sleep(2)
                        else:
                            logger.info('The file is already downloaded {}'.format(downloadFolder + '/' + fileName))
                    elif 'PV' in urlPDF and 'FNL' in urlPDF and '.pdf' in urlPDF:
                        # check if is an EP plenary sitting verbatim report of proceedings
                        file_exists = os.path.exists(downloadFolder + fileName)
                        if not file_exists:
                            headers = {
                                "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.8) "
                                              "Gecko/20100722 Firefox/3.6.8 GTB7.1 ( "".NET CLR 3.5.30729)"}
                            s = requests.Session()
                            s.proxies = {"https": "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"}

                            r = s.get(urlPDF)
                            print(f'Status Code: {r.status_code}')
                            chunk_size = 2000

                            with open(downloadFolder + '/' + fileName, 'wb') as fd:
                                for chunk in r.iter_content(chunk_size):
                                    fd.write(chunk)
                            time.sleep(2)
                        else:
                            logger.info('The file is already downloaded {}'.format(downloadFolder + '/' + fileName))

                else:
                    file_exists = os.path.exists(downloadFolder + '/' + fileName)
                    if not file_exists:
                        headers = {
                            "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.8) Gecko/20100722 "
                                          "Firefox/3.6.8 GTB7.1 (.NET CLR 3.5.30729)"}
                        s = requests.Session()
                        s.proxies = {"https": "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"}

                        r = s.get(urlPDF)
                        print(f'Status Code: {r.status_code}')
                        chunk_size = 2000

                        with open(downloadFolder + '/' + fileName, 'wb') as fd:
                            for chunk in r.iter_content(chunk_size):
                                fd.write(chunk)
                        time.sleep(2)
                    else:
                        logger.info('The file is already downloaded {}'.format(downloadFolder + '/' + fileName))

            except requests.exceptions.RequestException as err:
                print("Timeout Error:{}".format(err))
                logger.info("Timeout Error:{}".format(err))
                return err


# launch of the script
def main():
    if is_good_proxy(username, userpwd):
        # Start by going to the folder where the xml file are located
        for folder in os.listdir():
            folderLst = os.path.join(pathFolder, folder)
            for r, d, f in os.walk(folderLst):
                for file in f:
                    if '.xml' in file:
                        file_path = f"{folderLst}/{file}"
                        st_Main = time.time()
                        # call the function download_pdf_files which reads the xml file and look for the pdf url
                        # to download the pdf file.
                        download_pdf_files(optionToRun, file_path)
                        et_Main = time.time()
                        elapsed_time_Main = et_Main - st_Main
                        print("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                        logger.info("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                        elapsed_time_Main = None
                        et_Main = None


if __name__ != '__main__':
    pass
else:
    main()
