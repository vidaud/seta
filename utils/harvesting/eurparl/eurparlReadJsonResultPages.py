import json
import logging
import os
import re
import time
from datetime import datetime
from os.path import exists
from getpass import getpass
import requests
from testProxy import is_good_proxy

# The following script reads the download pages from script "EURPARLDLSearchRSLTFromUrl" and from these
# pages create the xml files of the single results

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
externalDir = 'C:/SeTA'
os.chdir('C:')
print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

# declaration of input variables to run the script
username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')

optionToRun = input('choose what you want to do: \n'
                    'download adopted-texts (A) \n'
                    'download plenary-documents (D)\n'
                    'download meetings (M)\n'
                    'download parliamentary-questions (Q)\n'
                    'download plenary-sessions (S): \n')

# setting the proxy
env_px = "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"
# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ["HTTPS_PROXY"] = env_px

# assignment of base folder, from where to start creating the folders,  if it does not exist then is created
base_folder = externalDir + '/EURPARL/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of log folder if it does not exist then is created
loggingFolder = base_folder + 'logs/logDownloadFiles/'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

if optionToRun == 'A':
    # setting the dest of log folder for adopted-texts
    loggingFolder = base_folder + 'logs/logparlAdopTxtFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'D':
    # setting the dest of log folder for plenary-documents
    loggingFolder = base_folder + 'logs/logDocsFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'M':
    # setting the dest of log folder for meetings
    loggingFolder = base_folder + 'logs/logMeetFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'Q':
    # setting the dest of log folder for parliamentary-questions
    loggingFolder = base_folder + 'logs/logQuestionsFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'S':
    # setting the dest of log folder for plenary-sessions
    loggingFolder = base_folder + 'logs/logSessionsFiles/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "log" + date_time + ".txt")
# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()

# assignment of folder where to save the files, if it does not exist then is created
pathFolder = externalDir + '/EURPARL/download_pages/'

# conditions for the different types of options selected when launching the script
# for adopted-texts
if optionToRun == 'A':
    pathFolder = base_folder + 'download_pages/parlAdopTxtLst/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files, if it does not exist then is created
    downloadFolder = base_folder + 'downloadFiles/parlAdopTxtFiles/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# for plenary-documents
if optionToRun == 'D':
    pathFolder = base_folder + 'download_pages/parl_docsLst/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files, if it does not exist then is created
    downloadFolder = base_folder + 'downloadFiles/parl_docsFiles/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# for meetings
if optionToRun == 'M':
    pathFolder = base_folder + 'download_pages/parlMeetLst/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files
    downloadFolder = base_folder + 'downloadFiles/parlMeetFiles/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# for parliamentary-questions
if optionToRun == 'Q':
    pathFolder = base_folder + 'download_pages/parl_questionsLst/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files, if it does not exist then is created
    downloadFolder = base_folder + 'downloadFiles/parl_questionsFiles/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# for plenary-sessions
if optionToRun == 'S':
    pathFolder = base_folder + 'download_pages/parlSessionsLst/'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the elements list does not exist')
        exit()

    # setting of destination folder for the saved files, if it does not exist then is created
    downloadFolder = base_folder + 'downloadFiles/parlSessionsFiles/'
    if not os.path.exists(downloadFolder):
        os.makedirs(downloadFolder)

# changing the current folder to the declared path folder destination
os.chdir(pathFolder)


# the following function reads the single json files gathered through the URL call made in the script
# "EURPARLDlLstDocs" and from the info of the results constructs the URL to download the xml file
def read_text_file(optionToRun, file_path):
    print(file_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        # get the year from the file path
        strYear = re.search(r'\d{4}', file_path)
        curYear = strYear.group()
        data = json.load(f)
        if data and curYear:
            if optionToRun == 'A':
                results = data["docs"]
                if not results:
                    logger.info("There are no results in the Json file: {}".format(file_path))
                    return False
                else:
                    logger.info("There are results in the Json file: {}".format(file_path))
                    for result in results:
                        idDoc = result['identifier']
                        urlTextXml = 'https://data.europarl.europa.eu/api/v1/adopted-texts/' + idDoc + '?language=en' \
                                                                                                       '&format=application%2Frdf%2Bxml'
                        saveFile(urlTextXml, idDoc, curYear)
                    return True

            elif optionToRun == 'D':
                results = data["docs"]
                if not results:
                    logger.info("There are no results in the Json file: {}".format(file_path))
                    return False
                else:
                    logger.info("There are results in the Json file: {}".format(file_path))
                    for result in results:
                        idDoc = result['identifier']
                        urlTextXml = 'https://data.europarl.europa.eu/api/v1/plenary-documents/' + idDoc + '?language=en' \
                                                                                                           '&format=application%2Frdf%2Bxml'
                        saveFile(urlTextXml, idDoc, curYear)
                    return True

            elif optionToRun == 'M':
                results = data["events"]
                if not results:
                    logger.info("There are no results in the Json file: {}".format(file_path))
                    return False
                else:
                    logger.info("There are results in the Json file: {}".format(file_path))
                    for result in results:
                        idDoc = result['activity_id']
                        urlTextXml = 'https://data.europarl.europa.eu/api/v1/meetings/' + idDoc + '?language=en' \
                                                                                                  '&format=application%2Frdf%2Bxml'
                        saveFile(urlTextXml, idDoc, curYear)
                    return True

            elif optionToRun == 'Q':
                results = data["docs"]
                if not results:
                    logger.info("There are no results in the Json file: {}".format(file_path))
                    return False
                else:
                    logger.info("There are results in the Json file: {}".format(file_path))
                    for result in results:
                        print(result['identifier'])
                        idDoc = result['identifier']
                        urlTextXml = 'https://data.europarl.europa.eu/api/v1/parliamentary-questions/' + idDoc + '?language=en' \
                                                                                                                 '&format=application%2Frdf%2Bxml'
                        saveFile(urlTextXml, idDoc, curYear)
                    return True

            elif optionToRun == 'S':
                if "docs" in data:
                    results = data["docs"]
                    if not results:
                        logger.info("There are no results in the Json file: {}".format(file_path))
                        return False
                    else:
                        logger.info("There are results in the Json file: {}".format(file_path))
                        for result in results:
                            print(result['identifier'])
                            idDoc = result['identifier']
                            urlTextXml = 'https://data.europarl.europa.eu/api/v1/plenary-session-documents/' + idDoc + '?language=en' \
                                                                                                                       '&format=application%2Frdf%2Bxml'
                            saveFile(urlTextXml, idDoc, curYear)
                        return True
                else:
                    if 'identifier' in data:
                        idDoc = data['identifier']
                        if 'http:' not in idDoc:
                            urlTextXml = 'https://data.europarl.europa.eu/api/v1/plenary-session-documents/' + idDoc + '?language=en' \
                                                                                                                       '&format=application%2Frdf%2Bxml'
                            saveFile(urlTextXml, idDoc, curYear)
                        return True
                    else:
                        logger.info("There are no results in the Json file: {}".format(file_path))
                        return False


# this function receives as input a URL, the id number of the item, it checks if the xml file
# is not saved already, if is not, then executes the request call to download the xml file and save it locally
def saveFile(urlPath, idDoc, curYear):
    try:
        formatType = urlPath[-3:]
        logger.info("Start downloading file: {}".format(urlPath))
        print("Start downloading file: {}".format(urlPath))
        yearFolder = downloadFolder + curYear
        if not os.path.exists(yearFolder):
            os.makedirs(yearFolder)
        file_exists = exists(
            yearFolder + '/' + idDoc + '.' + formatType)
        logger.info(
            'downloaded folder {}'.format(yearFolder + '/' + idDoc + '.' + formatType))
        print('urlpath {}'.format(urlPath))
        if not file_exists:
            st_save = time.time()
            urlFile = requests.get(urlPath, timeout=200)
            if urlFile.status_code != 200:
                urlFile = requests.get(urlPath, timeout=200)
                # get the end time
            et_save = time.time()
            elapsed_time_save = et_save - st_save
            print("elapsed_time of request: {}".format(elapsed_time_save))
            logger.info("elapsed_time of request: {}".format(elapsed_time_save))
            elapsed_time_save = None
            et_save = None
            st_request = time.time()
            print(len(urlFile.content))
            logger.info('length of xml file {} --> {}'.format(urlPath, len(urlFile.content)))
            if len(urlFile.content) > 158:
                with open(
                        yearFolder + '/' + idDoc + '.' + formatType, 'wb') as my_file:
                    my_file.write(urlFile.content)
                    filename = my_file.name
                    my_file.close()
                    et_request = time.time()
                    elapsed_time_request = et_request - st_request
                    print("elapsed_time of saving: {}".format(elapsed_time_request))
                    logger.info("elapsed_time of saving: {}".format(elapsed_time_request))
                    time.sleep(3)
                    elapsed_time_request = None
                    et_request = None
                    # update the file with the public URL
                    # addPublicUrlToFile(filename)
                    logger.info('File saved: {}'.format(filename))
        else:
            print('File already exists {}'.format(yearFolder + '/' + idDoc + '.' + formatType))

    except requests.exceptions.Timeout as errt:
        print("Timeout Error:{}".format(errt))
        logger.info("Timeout Error:{}".format(errt))
        return errt
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:".format(errc))
        logger.info("Error Connecting:{}".format(errc))
        return errc
    except requests.exceptions.RequestException as err:
        # catastrophic error. bail.
        logger.info("RequestException:{}".format(err))
        return err


# launch of the script
def main():
    # test if the credentials given at the start of the script are correct
    if is_good_proxy(username, userpwd):
        # start looking inside the files folders of pages
        for file in os.listdir():
            logger.info("Start program time {}".format(date_time))
            if optionToRun == 'S':
                filePath = f"{pathFolder}{file}"
                fileList = os.listdir(filePath)
                for jFiles in fileList:
                    if jFiles.endswith(".json"):
                        file_path = f"{filePath}/{jFiles}"
                        logger.info("Find file to read {}".format(file_path))
                        print("Find file to read {}".format(file_path))
                        # get the start time
                        st_Main = time.time()
                        # call the function read_text_file which reads the json file and look in the results the xml
                        # file of the single items to save.
                        isReadable = read_text_file(optionToRun, file_path)
                        et_Main = time.time()
                        elapsed_time_Main = et_Main - st_Main
                        print("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                        logger.info("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                        elapsed_time_Main = None
                        et_Main = None
            else:
                # check if the file to read is a json type
                fileList = os.listdir(file)
                for jFile in fileList:
                    if jFile.endswith(".json"):
                        file_path = f"{pathFolder}{file}/{jFile}"
                        logger.info("Find file to read {}".format(file_path))
                        print("Find file to read {}".format(file_path))
                        # get the start time
                        st_Main = time.time()
                        # call the function read_text_file which reads the json file and look in the results the xml
                        # file of the single items to save.
                        isReadable = read_text_file(optionToRun, file_path)
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
