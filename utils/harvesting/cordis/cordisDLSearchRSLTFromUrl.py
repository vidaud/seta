import json
import logging
import math
import os
import sys
import time
from datetime import datetime
from getpass import getpass
from os.path import exists

import requests

from testProxy import is_good_proxy

# The following script download the results pages of the search in CORDIS of all items in English language

# getting current date to use later for document
now = datetime.now()
date_time = now.strftime('%Y%m%d%H%M%S')
date_format = now.strftime('%Y%m%d')

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# assignment of base folder, from where to start creating the folders, if it does not exist then is created
base_folder = startDir + '/CORDIS/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of folder where to save the files, if it does not exist then is created
pathFolder = startDir + '/CORDIS/download_pages/cordis_all_eng/'
# if the folder does not exist, then is created
if not os.path.exists(pathFolder):
    os.makedirs(pathFolder)

local = False

# declaration of input proxy variables and options to run the script
username = input('insert your internet proxy username: ')
userpwd = getpass(prompt='insert your internet proxy password: ')
optionToRun = input(
    'choose what you want to do: \nupdate existing data (U) \nadd new data (A) \ndownload all data (D): ')

dateUpdate = None
dateDownload = None

# assignment of log folder if it does not exist then is created
loggingFolder = base_folder + 'logs/logDownloadPages'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

# conditions for the different types of options selected when launching the script
if optionToRun == 'U': # this option is for download files with an update date
    dateUpdate = input('insert the date to update eg. YYYY-MM-DD:')
    if not datetime.strptime(dateUpdate, '%Y-%m-%d'):
        print("Incorrect data format, should be YYYY-MM-DD")
        exit()
    else:
        pathFolder = startDir + '/CORDIS/update_pages/cordis_all_eng/'
        if not os.path.exists(pathFolder):
            os.makedirs(pathFolder)

        loggingFolder = base_folder + 'logs/logUpdatePages'
        if not os.path.exists(loggingFolder):
            os.makedirs(loggingFolder)

if optionToRun == 'A': # option to download new data in this case there are two downloads:
    # new data filtered by contentCreationDate and new data filtered by startDate
    dateDownload = input('insert the date to start downloading new files eg. YYYY-MM-DD:')
    if not datetime.strptime(dateDownload, '%Y-%m-%d'):
        print("Incorrect data format, should be YYYY-MM-DD")
        exit()
    else:
        pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng/'
        if not os.path.exists(pathFolder):
            os.makedirs(pathFolder)

        pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng/'
        if not os.path.exists(pathFolder):
            os.makedirs(pathFolder)

        loggingFolder = base_folder + 'logs/logNewPages'
        if not os.path.exists(loggingFolder):
            os.makedirs(loggingFolder)

# setting the proxy with the credentials given when launching the script
env_px = 'http://' + username + ':' + userpwd + '@autoproxy.cec.eu.int:8012'
# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ['HTTPS_PROXY'] = env_px

# setting the log file name and the destination path
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(message)s',
                    filename=loggingFolder + '/log' + date_time + '.txt')

# declaring variable logger that will be writing into the log txt file
logger = logging.getLogger()

logger.info('File location using os.path.realpath:{}'.format(startDir))


# function to download the first page and calculate the total of pages to go through
def initialUrlCall(optionToRun, dateUpdate, dateDownload, pathFolder):
    global urlTxt
    try:
        if optionToRun == 'Ac': # for option A we split in two the folders to download the files
            pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng/'
            file_exists = exists(pathFolder + 'page_1.json')
        elif optionToRun == 'As':
            pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng/'
            file_exists = exists(pathFolder + 'page_1.json')
        else:
            file_exists = exists(pathFolder + 'page_1.json')
        pageNum = '1'
        numResults = '100'
        resultsValues = []
        # we create the query according to the option of download all the data in English language
        if optionToRun == 'D':
            urlTxt = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27&p=' + pageNum + '&num=' \
                     + numResults + '&srt=Relevance:decreasing&fields=title,id,code,rcn,startDate,endDate,teaser,' \
                                    'contentUpdateDate,name,relatedImage,availableLanguages,language,uri,issueNumber,' \
                                    'issueDate,issueLastDate,issue,archivedDate,acronym,legalName,euCode,city,' \
                                    'country,iprPrefix,iprNumber,iprDate,iprAwarded,description,doi,journalTitle,' \
                                    'journalNumber,publishedYear,publishedPages,authors,periodFrom,' \
                                    'periodTo&as_ARCH=true '
        # we create the query according to the option of update the data in English language
        elif optionToRun == 'U' and dateUpdate:
            urlTxt = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20contentUpdateDate%3E%3D' \
                     + dateUpdate + '&p=' + pageNum + '&num=' + numResults + '&srt=Relevance:decreasing&fields=title,' \
                                                                             'id,code,rcn,startDate,endDate,teaser,' \
                                                                             'contentUpdateDate,name,relatedImage,' \
                                                                             'availableLanguages,' \
                                                                             'language,uri,issueNumber,issueDate,' \
                                                                             'issueLastDate,issue,archivedDate,' \
                                                                             'acronym,legalName,euCode,' \
                                                                             'city,country,iprPrefix,iprNumber,' \
                                                                             'iprDate,iprAwarded,description,doi,' \
                                                                             'journalTitle,journalNumber,' \
                                                                             'publishedYear,publishedPages,authors,' \
                                                                             'periodFrom,periodTo&as_ARCH=true '
        # in this option we do two queries one for data with content creation date
        elif optionToRun == 'Ac' and dateDownload:
            urlTxt = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20contentCreationDate%3E%3D' \
                     + dateDownload + '&p=' + pageNum + '&num=' + numResults + '&srt=Relevance:decreasing&fields=title' \
                                                                               ',id,code,rcn,startDate,endDate,' \
                                                                               'teaser,contentUpdateDate,name,' \
                                                                               'relatedImage,availableLanguages,' \
                                                                               'language,uri,issueNumber,issueDate,' \
                                                                               'issueLastDate,issue,archivedDate,' \
                                                                               'acronym,legalName,euCode,city,' \
                                                                               'country,iprPrefix,iprNumber,' \
                                                                               'iprDate,iprAwarded,description,doi,' \
                                                                               'journalTitle,journalNumber,' \
                                                                               'publishedYear,publishedPages,' \
                                                                               'authors,periodFrom,' \
                                                                               'periodTo&as_ARCH=true '
            pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng/'
        # the second option is to gather data with startDate
        elif optionToRun == 'As' and dateDownload:
            urlTxt = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20startDate%3E%3D' \
                     + dateDownload + '&p=' + pageNum + '&num=' + numResults + '&srt=Relevance:decreasing&fields=title' \
                                                                               ',id,code,rcn,startDate,endDate,' \
                                                                               'teaser,contentUpdateDate,name,' \
                                                                               'relatedImage,availableLanguages,' \
                                                                               'language,uri,issueNumber,issueDate,' \
                                                                               'issueLastDate,issue,archivedDate,' \
                                                                               'acronym,legalName,euCode,city,' \
                                                                               'country,iprPrefix,iprNumber,' \
                                                                               'iprDate,iprAwarded,description,doi,' \
                                                                               'journalTitle,journalNumber,' \
                                                                               'publishedYear,publishedPages,' \
                                                                               'authors,periodFrom,' \
                                                                               'periodTo&as_ARCH=true '
            pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng/'

        # we check if the urlTxt var is selected and if the page has not been downloaded
        if urlTxt and not file_exists:
            logger.info('Url request for initial page with 100 results: ' + urlTxt)
            url = requests.get(urlTxt, timeout=120).text
            data = json.loads(url)
            s = json.dumps(data)
            # we check if the downloaded file is not empty by checking a minimun size
            if sys.getsizeof(s) < 6000:
                print('the file is too small to download')
                logger.info('the file is too small to download {} size {}'.format(urlTxt, sys.getsizeof(s)))
                logger.info('data from the downloaded page {}'.format(data))
                return 'file too small'
            # if the file is downloaded correctly we save it
            else:
                open(pathFolder + 'page_' + pageNum + '.json', 'w').write(s)
                logger.info('Destination file ' + pathFolder + 'page_' + pageNum + '.json')
                time.sleep(5)
                total = data['payload']['total']
                intTotal = int(total)
                numPages = intTotal / 100
                intTotal = math.ceil(numPages)
                resultsValues.append(numPages)
                resultsValues.append(intTotal)
                logger.info('Number of pages: {}'.format(numPages))
                logger.info('Number of pages after round: {}'.format(intTotal))
                print(numPages)
                print(intTotal)
                return resultsValues
        else:
            if file_exists:
                logger.info('The initial page is been download already')
            if not urlTxt:
                logger.info('one of the executions options is not complete')
                return
# we set up exceptions for time out, connection, and request
    except requests.exceptions.Timeout as errt:
        print('Timeout Error: {}'.format(errt))
        logger.info('Timeout Error: {}'.format(errt))
        return errt
    except requests.exceptions.ConnectionError as errc:
        print('Error Connecting:{}'.format(errc))
        logger.info('Error Connecting:{}'.format(errc))
        return errc
    except requests.exceptions.RequestException as err:
        logger.info('RequestException:{}'.format(err))
        return err


# function to download all the pages related to the query
def downloadResultPages(optionToRun, intTotal, dateUpdate, dateDownload, pathFolder):
    global urlText
    smallPages = []
    try:
        for numPage in range(2, intTotal + 1):
            logger.info('current page {}'.format(numPage))
            if optionToRun == 'Ac':
                pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng/'
                if not os.path.exists(pathFolder):
                    os.makedirs(pathFolder)
                file_exists = exists(pathFolder + 'page_' + str(numPage) + '.json')
            elif optionToRun == 'As':
                pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng/'
                if not os.path.exists(pathFolder):
                    os.makedirs(pathFolder)
                file_exists = exists(pathFolder + 'page_' + str(numPage) + '.json')
            else:
                file_exists = exists(pathFolder + 'page_' + str(numPage) + '.json')
            if not file_exists:
                strPage = str(numPage)
                strResults = '100'
                if optionToRun == 'D':
                    urlText = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27&p=' + strPage + '&num=' \
                              + strResults + '&srt=Relevance:decreasing&fields=title,' \
                                'id,code,rcn,startDate,endDate,teaser,contentUpdateDate,name,relatedImage,availableLanguages,' \
                                'language,uri,issueNumber,issueDate,issueLastDate,' \
                                'issue,archivedDate,acronym,authors,periodFrom,periodTo&as_ARCH=true'
                elif optionToRun == 'U' and dateUpdate:
                    urlText = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20contentUpdateDate%3E%3D' + dateUpdate + '&p=' + strPage + '&num=' + strResults + '&srt=Relevance:decreasing&fields=title,' \
                     'id,code,rcn,startDate,endDate,teaser,contentUpdateDate,name,relatedImage,availableLanguages,language,uri,issueNumber,issueDate,issueLastDate,' \
                     'issue,archivedDate,acronym,authors,periodFrom,periodTo&as_ARCH=true'
                elif optionToRun == 'Ac' and dateDownload:
                    urlText = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20contentCreationDate%3E%3D' + dateDownload + '&p=' + strPage + '&num=' + strResults + '&srt=Relevance:decreasing&fields=title,id,code,rcn,startDate,endDate,teaser,contentUpdateDate,name,relatedImage,availableLanguages,language,uri,issueNumber,issueDate,issueLastDate,' \
                     'issue,archivedDate,acronym,authors,periodFrom,periodTo&as_ARCH=true'
                    pathFolder = startDir + '/CORDIS/new_pagesAc/cordis_all_eng/'
                elif optionToRun == 'As' and dateDownload:
                    urlText = 'https://cordis.europa.eu/api/search/results?q=language=%27en%27%20AND%20startDate%3E%3D' + dateDownload + '&p=' + strPage + '&num=' + strResults + '&srt=Relevance:decreasing&fields=title,' \
                    'id,code,rcn,startDate,endDate,teaser,contentUpdateDate,name,relatedImage,availableLanguages,language,uri,issueNumber,issueDate,issueLastDate,' \
                    'issue,archivedDate,acronym,authors,periodFrom,periodTo&as_ARCH=true'
                    pathFolder = startDir + '/CORDIS/new_pagesAs/cordis_all_eng/'

                if not urlText:
                    logger.info('one of the executions options is not complete')
                    return
                else:
                    logger.info('Url request for current page and 100 results: ' + urlText)
                    url = requests.get(urlText, timeout=120).text
                    try:
                        data = json.loads(url)
                        s = json.dumps(data)
                        if sys.getsizeof(s) < 6000:
                            logger.info(
                                'the file is too small to download {} size {}'.format(urlText, sys.getsizeof(s)))
                            logger.info('data from the downloaded page {}'.format(data))
                            continue
                        else:
                            open(pathFolder + 'page_' + strPage + '.json', 'w').write(s)
                            logger.info('Destination file ' + pathFolder + 'page_' + strPage + '.json')
                            time.sleep(25)
                    except:
                        logger.info('No JSON data')

    except requests.exceptions.Timeout as errt:
        print('Timeout Error: {}'.format(errt))
        logger.info('Timeout Error: {}'.format(errt))
        return errt
    except requests.exceptions.ConnectionError as errc:
        print('Error Connecting:{}'.format(errc))
        logger.info('Error Connecting:{}'.format(errc))
        return errc
    except requests.exceptions.RequestException as err:
        logger.info('RequestException:{}'.format(err))
        return err


# launch of the script
def main():
    # test if the credentials given at the start of the script are correct and bypass the proxy
    if is_good_proxy(username, userpwd):
        if optionToRun == 'A' and dateDownload: # if option is A, we execute two functions sequentially
            logger.info('executing add of new elements with intialUrlCall function')
            #first function to gather data by content creation date
            valuesResultAc = initialUrlCall("Ac", dateUpdate, dateDownload, pathFolder)
            logger.info('result from intialUrlCall of new elements added function content creation date: {}'.format(valuesResultAc))
            time.sleep(30)
            if valuesResultAc:
                for numPage in range(2, valuesResultAc[1]):
                    logger.info('Starting the download of the found pages: {}'.format(valuesResultAc[1]))
                    ret = downloadResultPages("Ac",valuesResultAc[1], dateUpdate, dateDownload, pathFolder)
                    if ret is None:
                        logger.info('End of download ....')
                        break
                    else:
                        print('SomeThing Failed ....{}'.format(ret))
                        logger.info('SomeThing Failed ....{}'.format(ret))
                        time.sleep(30)
                        downloadResultPages("Ac", valuesResultAc[1], dateUpdate, dateDownload, pathFolder)
            # second function to gather data by start date
            valuesResultAs = initialUrlCall("As", dateUpdate, dateDownload, pathFolder)
            logger.info('result from intialUrlCall of new elements added function start date: {}'.format(valuesResultAs))
            time.sleep(30)
            if valuesResultAs:
                for numPage in range(2, valuesResultAs[1]):
                    logger.info('Starting the download of the found pages: {}'.format(valuesResultAs[1]))
                    ret = downloadResultPages("As", valuesResultAs[1], dateUpdate, dateDownload, pathFolder)
                    if ret is None:
                        logger.info('End of download ....')
                        break
                    else:
                        print('SomeThing Failed ....{}'.format(ret))
                        logger.info('SomeThing Failed ....{}'.format(ret))
                        time.sleep(30)
                        downloadResultPages(valuesResultAs[1], dateUpdate, dateDownload, pathFolder)
        else:
            # we execute the other type of option (download all, only update data)
            valuesResult = initialUrlCall(optionToRun, dateUpdate, dateDownload, pathFolder)
            logger.info('result from intialUrlCall function: {}'.format(valuesResult))
            time.sleep(30)
            if valuesResult:
                for numPage in range(2, valuesResult[1]):
                    logger.info('Starting the download of the found pages: {}'.format(valuesResult[1]))
                    ret = downloadResultPages(optionToRun,valuesResult[1], dateUpdate, dateDownload, pathFolder)
                    if ret is None:
                        logger.info('End of download ....')
                        break
                    else:
                        print('SomeThing Failed ....{}'.format(ret))
                        logger.info('SomeThing Failed ....{}'.format(ret))
                        time.sleep(30)
                        downloadResultPages(optionToRun,valuesResult[1], dateUpdate, dateDownload, pathFolder)


if __name__ != '__main__':
    pass
else:
    main()
