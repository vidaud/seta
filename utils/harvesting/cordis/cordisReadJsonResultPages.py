import json
import logging
import os
import socket
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from getpass import getpass
from http.client import RemoteDisconnected
from os.path import exists
from urllib.error import URLError
from urllib.request import urlopen

import requests

from testProxy import is_good_proxy

# The following script reads the download pages from script "cordisDLSearchRSLTFromUrl" and from these
# pages create the xml files of the single results

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

print("File location using os.getcwd():", startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

# declaration of input variables to run the script
username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')
optionToRun = input(
    'choose what you want to do: \n download update existing files (U) \n download new files (A) \n download all files (D): ')

# setting the proxy
env_px = "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"

# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ["HTTPS_PROXY"] = env_px

# assignment of base folder, from where to start creating the folders, if it does not exist then is created
base_folder = startDir + '/CORDIS/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of folder where to read the files,
pathFolder = startDir + '/CORDIS/download_pages/cordis_all_eng'

# conditions for the different types of options selected when launching the script
if optionToRun == 'D':
    if not os.path.exists(pathFolder):  # if it does not exist then the script terminate
        print("There is no folder to read the files")
        exit()

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logDownloadFiles'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'U':
    pathFolder = startDir + '/CORDIS/update_pages/cordis_all_eng'

    # path where to look for the files, if it does not exist then the script terminate
    if not os.path.exists(pathFolder):
        print("There is no folder to read the files")
        exit()

    loggingFolder = base_folder + 'logs/logUpdateFiles'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'A':  # in this option we check on both folders
    pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng'
    if not os.path.exists(pathFolder):
        pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng'
        if not os.path.exists(pathFolder):
            print("There is no folder to read the files")
            exit()
    loggingFolder = base_folder + 'logs/logNewFiles'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

# setting of only destination folder for the saved files
downloadFolder = base_folder + 'downloadFiles/xmlFiles'
if not os.path.exists(downloadFolder):
    os.makedirs(downloadFolder)

# changing the current folder to the declared path folder destination
os.chdir(pathFolder)

# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/log" + date_time + ".txt")

# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()


# the following function reads the single json files gathered through the URL call made in the script
# "cordisDLSearchRSLTFromUrl" and from the info of the results constructs the URL to download the xml file
def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:  # open the file
        data = json.load(f)
        results = data["payload"]["results"]  # look into the json file
        if not results:
            logger.info("There are no results in the Json file: {}".format(file_path))
            return False
        else:
            logger.info("There are results in the Json file: {}".format(file_path))
            for result in results:
                headers = {
                    "User-Agent": "Chrome/51.0.2704.103",
                }
                url1stPart = 'https://cordis.europa.eu/'
                rcn = result['rcn']
                contentType = result['contentType']
                # this is to save the data in pdf format for now is disabled
                # urlTextPdf = url1stPart + contentType + "/rcn/" + rcn + "/en?format=pdf"
                # saveFile(urlTextPdf, rcn, contentType)
                urlTextXml = url1stPart + contentType + "/rcn/" + rcn + "/en?format=xml"
                logger.info('file XML to download {}'.format(urlTextXml))
                saveFile(urlTextXml, rcn, contentType)
            return True


# this function receives as input a URL, the RCN number of the item and the type of item, it checks if the xml file
# is not saved already, if is not, then executes the request call to download the xml file and save it locally
# after saving locally, it checks if there is a public URL through the function "addPublicUrlToFile"
def saveFile(urlPath, rcn, contentType):
    try:
        formatType = urlPath[-3:]
        logger.info("Start downloading file: {}".format(urlPath))
        file_exists = exists(
            downloadFolder + '/' + contentType + '_rcn_' + rcn + '.' + formatType)
        logger.info(
            'downloaded folder {}'.format(downloadFolder + '/' + contentType + '_rcn_' + rcn + '.' + formatType))
        if not file_exists:
            st_save = time.time()
            urlFile = requests.get(urlPath, timeout=90)
            logger.info("File status code: {}".format(urlFile.status_code))
            # get the end time
            et_save = time.time()
            elapsed_time_save = et_save - st_save
            print("elapsed_time of request: {}".format(elapsed_time_save))
            logger.info("elapsed_time of request: {}".format(elapsed_time_save))
            elapsed_time_save = None
            et_save = None
            if urlFile.status_code == 200:
                st_request = time.time()
                with open(
                        downloadFolder + '/' + contentType + '_rcn_' + rcn + '.' + formatType, 'wb') as my_file:
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
                    addPublicUrlToFile(filename)
                    logger.info('File saved: {}'.format(filename))
            else:
                stsCode = str(urlFile.status_code)
                logger.info("The file could not be found {} ---Status code: {}".format(urlPath, stsCode))
        else:
            if optionToRun == 'U':
                st_save = time.time()
                urlFile = requests.get(urlPath, timeout=90)
                logger.info("File status code: {}".format(urlFile.status_code))
                # get the end time
                et_save = time.time()
                elapsed_time_save = et_save - st_save
                print("elapsed_time of request: {}".format(elapsed_time_save))
                logger.info("elapsed_time of request: {}".format(elapsed_time_save))
                elapsed_time_save = None
                et_save = None
                if urlFile.status_code == 200:
                    st_request = time.time()
                    with open(
                            downloadFolder + '/' + contentType + '_rcn_' + rcn + '.' + formatType, 'wb') as my_file:
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
                        addPublicUrlToFile(filename)
                        logger.info('File saved: {}'.format(filename))
                else:
                    stsCode = str(urlFile.status_code)
                    logger.info("The file could not be found {} ---Status code: {}".format(urlPath, stsCode))
            else:
                logger.info(
                    "The file already exists: " + downloadFolder + '/' + contentType + '_rcn_' + rcn + '.' + formatType)
                return True
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:{}".format(errt))
        logger.info("Timeout Error:{}".format(errt))
        return errt
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:".format(errc))
        logger.info("Error Connecting:{}".format(errc))
        return errc
    except requests.exceptions.RequestException as err:
        logger.info("RequestException:{}".format(err))
        return err


# this function check that the recent xml file has a public url and if it does, then add the tag with the public
# URL to the xml file
def addPublicUrlToFile(filename):
    global url
    try:
        logger.info('file xml to update with public url:{}'.format(filename))
        file_name_part = filename.rpartition('/')[2]
        file_name_toSave = filename.rpartition('/')[2]
        file_name_part = file_name_part.replace("_", "/", 2)
        file_name_part = file_name_part.replace(".xml", "")
        logger.info('filename part to use for call the public url {}'.format(file_name_part))
        public_url = 'https://cordis.europa.eu/'
        public_url = public_url + file_name_part
        logger.info('public url to test:{}'.format(public_url))
        print('public url to test:{}'.format(public_url))
        url = urlopen(public_url, timeout=90)
        if url.getcode() == 200:
            xml = ET.parse(filename)
            root = xml.getroot()
            child = ET.Element("public_url")
            child.text = '\"' + public_url + '\"'
            root.append(child)
            f = open(downloadFolder + '/' + file_name_toSave, "wb")
            ET.register_namespace("", "http://cordis.europa.eu")
            xml.write(f, xml_declaration=True, method="xml", encoding="utf8", default_namespace=None)
            logger.info('file xml with public url added:{}'.format(filename))
        else:
            stsCode = str(url.status_code)
            logger.info("The file could not be found {} ---Status code: {}".format(public_url, stsCode))

    except URLError as errt2:
        print("Timeout Error:", errt2)
        logger.info("Timeout Error: {}".format(errt2))
    except socket.timeout as errs2:
        print("Error Connecting: {}".format(errs2))
        logger.info("Error Connecting: {}".format(errs2))
    except RemoteDisconnected:
        print("url {} did not return a valid response".format(url))


# launch of the script
def main(pathFolder):
    # test if the credentials given at the start of the script are correct
    if is_good_proxy(username, userpwd):
        if optionToRun != 'A':
            for file in os.listdir():
                file_path = f"{pathFolder}/{file}"
                logger.info("Find file to read {}".format(file_path))
                print("Find file to read {}".format(file_path))
                # get the start time
                st_Main = time.time()
                # call the function read_text_file which reads the json file and look in the results the xml file of
                # the single items to save.
                isReadable = read_text_file(file_path)
                et_Main = time.time()
                elapsed_time_Main = et_Main - st_Main
                print("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                logger.info("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                elapsed_time_Main = None
                et_Main = None
                if not isReadable:
                    print('SomeThing Failed ....')
                    logger.info("SomeThing Failed ....")
                    time.sleep(20)
                    st_reboot = time.time()
                    readAgain = read_text_file(file_path)
                    et_reboot = time.time()
                    elapsed_time_reboot = et_reboot - st_reboot
                    print("elapsed_time of whole read_text_file: {}".format(elapsed_time_reboot))
                    logger.info("elapsed_time of whole read_text_file reboot: {}".format(elapsed_time_reboot))
                    elapsed_time_reboot = None
                    et_reboot = None
        else:  # for option A, we read sequentially the two folders of the downloaded json pages
            # first we read the folder of data with creation date
            pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng'
            os.chdir(pathFolder)
            print('os list dir {}'.format(os.listdir()))
            for file in os.listdir():
                file_path = f"{pathFolder}/{file}"
                logger.info("Start program time {}".format(date_time))
                # check if the file to read is a json type
                if file.endswith(".json"):
                    logger.info("Find file to read {}".format(file_path))
                    print("Find file to read {}".format(file_path))
                    # get the start time
                    st_Main = time.time()
                    # call the function read_text_file which reads the json file and look in the results the xml file of
                    # the single items to save.
                    isReadable = read_text_file(file_path)
                    et_Main = time.time()
                    elapsed_time_Main = et_Main - st_Main
                    print("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                    logger.info("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                    elapsed_time_Main = None
                    et_Main = None
                    if not isReadable:
                        print('SomeThing Failed ....')
                        logger.info("SomeThing Failed ....")
                        time.sleep(20)
                        st_reboot = time.time()
                        readAgain = read_text_file(file_path)
                        et_reboot = time.time()
                        elapsed_time_reboot = et_reboot - st_reboot
                        print("elapsed_time of whole read_text_file: {}".format(elapsed_time_reboot))
                        logger.info("elapsed_time of whole read_text_file reboot: {}".format(elapsed_time_reboot))
                        elapsed_time_reboot = None
                        et_reboot = None
            # then we read the folder of data with start date
            pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng'
            os.chdir(pathFolder)
            print('os list dir {}'.format(os.listdir()))
            for file in os.listdir():
                file_path = f"{pathFolder}/{file}"
                logger.info("Find file to read {}".format(file_path))
                print("Find file to read {}".format(file_path))
                # get the start time
                st_Main = time.time()
                # call the function read_text_file which reads the json file and look in the results the xml file of
                # the single items to save.
                isReadable = read_text_file(file_path)
                et_Main = time.time()
                elapsed_time_Main = et_Main - st_Main
                print("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                logger.info("elapsed_time of whole read_text_file: {}".format(elapsed_time_Main))
                elapsed_time_Main = None
                et_Main = None
                if not isReadable:
                    print('SomeThing Failed ....')
                    logger.info("SomeThing Failed ....")
                    time.sleep(20)
                    st_reboot = time.time()
                    readAgain = read_text_file(file_path)
                    et_reboot = time.time()
                    elapsed_time_reboot = et_reboot - st_reboot
                    print("elapsed_time of whole read_text_file: {}".format(elapsed_time_reboot))
                    logger.info("elapsed_time of whole read_text_file reboot: {}".format(elapsed_time_reboot))
                    elapsed_time_reboot = None
                    et_reboot = None


if __name__ != '__main__':
    pass
else:
    main(pathFolder)
