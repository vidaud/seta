import glob
import json
import logging
import os
import re
import time
from datetime import date
from datetime import datetime
from getpass import getpass
from os.path import exists

import requests

from testProxy import is_good_proxy

# The following script download the results pages from the search in EURPARL of all items in English language

# getting current date to use later for document
now = datetime.now()
date_time = now.strftime('%Y%m%d%H%M%S')
date_format = now.strftime('%Y%m%d')

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# assignment of base folder, from where to start creating the folders, if the folder does not exist then is created
base_folder = startDir + '/EURPARL/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of folder where to save the files, if the folder does not exist then is created
pathFolder = base_folder + 'download_pages'
# if the folder does not exist, then create it
if not os.path.exists(pathFolder):
    os.makedirs(pathFolder)

local = False

# declaration of input variables to run the script
username = input('insert your internet proxy username: ')
userpwd = getpass(prompt='insert your internet proxy password: ')

optionToRun = input('choose what you want to do: \n'
                    'download adopted-texts list (A)\n'
                    'download plenary-documents list (D)\n'
                    'download meetings list (M)\n'
                    'download parliamentary-questions list (Q)\n'
                    'download plenary-session list (S):\n')

optionYeartoStart = None

if optionToRun != 'S':
    optionYeartoStart = input('from which year to start downloading: \t')

dateUpdate = None
dateDownload = None

# declaring variable logger that will be writing into the log txt file
logger = logging.getLogger()

logger.info('File location using os.path.realpath:{}'.format(startDir))

# conditions for the different types of options selected when launching the script
if optionToRun == 'A':
    # for adopted-texts list
    # if the folder does not exist then is created
    pathFolder = pathFolder + '/parlAdopTxtLst'
    if not os.path.exists(pathFolder):
        os.makedirs(pathFolder)

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logAdopTxtLst/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'D':
    # for plenary-documents list
    # if the folder does not exist then is created
    pathFolder = pathFolder + '/parl_docsLst'
    if not os.path.exists(pathFolder):
        os.makedirs(pathFolder)

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logDocsLst/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'M':
    # for meetings list
    # if the folder does not exist then is created
    pathFolder = pathFolder + '/parlMeetLst'
    if not os.path.exists(pathFolder):
        os.makedirs(pathFolder)

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logMeetLst/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'Q':
    # for parliamentary-questions list
    # if the folder does not exist then is created
    pathFolder = pathFolder + '/parl_questionsLst'
    if not os.path.exists(pathFolder):
        os.makedirs(pathFolder)

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logQuestionsLst/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

if optionToRun == 'S':
    # for plenary-session list
    # look first if the Meetings list folder exists
    meetingPathFolder = pathFolder + '/parlMeetLst'
    if not os.path.exists(pathFolder):
        logger.info('The folder with the Meetings list does not exist, verify')
        exit()

    # if the folder does not exist then is created
    pathFolder = pathFolder + '/parlSessionsLst'
    if not os.path.exists(pathFolder):
        os.makedirs(pathFolder)

    # assignment of log folder if it does not exist then is created
    loggingFolder = base_folder + 'logs/logSessionsLst/'
    if not os.path.exists(loggingFolder):
        os.makedirs(loggingFolder)

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "log" + date_time + ".txt")
# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()

print('logging folder {}'.format(loggingFolder))

logger.info('File location using os.path.realpath:{}'.format(startDir))
# setting the proxy with the credentials given when launching the script
env_px = 'http://' + username + ':' + userpwd + '@autoproxy.cec.eu.int:8012'
# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ['HTTPS_PROXY'] = env_px

# setting the cur year
todays_date = date.today()
currYear = todays_date.year

if optionYeartoStart:
    startYear = optionYeartoStart


# function to download the first page and calculate the total of pages to go through
def urlCallListByYear(optionToRun, startYear='2011', currYear=currYear):
    global urlTxt
    try:
        for curYear in range(int(startYear), currYear + 1):
            yearFolder = pathFolder + '/' + str(curYear)
            if not os.path.exists(yearFolder):
                os.makedirs(yearFolder)
            file_exists = exists(pathFolder + 'page_' + str(curYear) + '.json')
            if not file_exists:
                if optionToRun == 'A':
                    urlTxt = 'https://data.europarl.europa.eu/api/v1/adopted-texts?year=' + str(
                        curYear) + '&work-type=ADOPT_TEXT&language=en&format=application%2Fld%2Bjson&offset=0'

                elif optionToRun == 'D':
                    urlTxt = 'https://data.europarl.europa.eu/api/v1/plenary-documents?year=' + str(
                        curYear) + '&work-type=REPORT,MOTION_RES,JOINT_MOTION_RES&' \
                                   'language=en&format=application%2Fld%2Bjson&offset=0'
                elif optionToRun == 'M':
                    urlTxt = 'https://data.europarl.europa.eu/api/v1/meetings?year=' + str(
                        curYear) + '&language=en&format=application%2Fld%2Bjson' \
                                   '&offset=0'

                elif optionToRun == 'Q':
                    urlTxt = 'https://data.europarl.europa.eu/api/v1/parliamentary-questions?year=' + str(
                        curYear) + '&work-type=QUEST_WRITTEN_PRIORITY_EP,QUEST_WRITTEN,QUEST_ORAL,INTERPEL_MAJ_EP,' \
                                   'INTERPEL_MIN_EP,QUEST_TIME&language=en&format=application%2Fld%2Bjson' \
                                   '&offset=0'

                logger.info(
                    'Url request for initial page with results:' + urlTxt + ' with option to run: ' + optionToRun)
                print('Url request for initial page with results:' + urlTxt + ' with option to run: ' + optionToRun)
                url = requests.get(urlTxt, timeout=360)
                if url.status_code != 200:
                    url = requests.get(urlTxt, timeout=360)
                    print(url.status_code)
                    if url.status_code == 200:
                        data = json.loads(url.text)
                        if data:
                            s = json.dumps(data)
                            if optionToRun == 'A':
                                open(yearFolder + '/' + str(curYear) + '.json', 'w').write(s)
                                logger.info('Destination file ' + yearFolder + '/' + str(curYear) + '.json')
                                time.sleep(3)
                        else:
                            logger.info('No data from query: ' + urlTxt)
                else:
                    data = json.loads(url.text)
                    if data:
                        s = json.dumps(data)
                        open(yearFolder + '/' + str(curYear) + '.json', 'w').write(s)
                        logger.info('Destination file ' + yearFolder + '/' + str(curYear) + '.json')
                        time.sleep(3)
                    else:
                        logger.info('No data from query: ' + urlTxt)
            else:
                logger.info('The file in folder :' + yearFolder + ' is been downloaded already')

        else:
            logger.info('The file page_' + str(curYear) + '.json is been download already')

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


# This functions looks for the different types of Plenary Session Documents
def urlCallListForSessions(optionToRun, meetingPathFolder, currYear=currYear):
    global urlTxt
    # start reading the folders from the meetings and convert them in number
    directoryMeeting = os.listdir(meetingPathFolder)
    if len(directoryMeeting):
        listNumber = [eval(i) for i in directoryMeeting]
        listNumber.sort()
        try:
            for curYear in range(listNumber[0], currYear + 1):
                yearFolder = pathFolder + '/' + str(curYear)
                if not os.path.exists(yearFolder):
                    os.makedirs(yearFolder)
                file_exists = exists(pathFolder + 'page_' + str(curYear) + '.json')
                if not file_exists:
                    # first grab the code from the meetings file
                    files = [f for f in glob.glob(meetingPathFolder + "/" + str(curYear) + "/*.json", recursive=True)]
                    print(meetingPathFolder + "/" + str(curYear) + "/*.json")
                    for f in files:
                        # print(f)
                        with open(f, 'r', encoding='utf-8') as jsonFile:
                            # get the year from the file path
                            strYear = re.search(r'\d{4}', jsonFile.name)
                            curYear = strYear.group()
                            data = json.load(jsonFile)
                            if data and curYear:
                                results = data["events"]
                                if results:
                                    for result in results:
                                        idDoc = result['activity_id']
                                        dateRegex = strYear = re.search(r'\d{4}-\d{2}-\d{2}', idDoc)
                                        dateSession = dateRegex.group()
                                        yearFolder = pathFolder + '/' + str(curYear)
                                        if not os.path.exists(yearFolder):
                                            os.makedirs(yearFolder)
                                        file_Sess_exists = exists(
                                            yearFolder + '/sess_' + str(dateSession) + '.json')
                                        if not file_Sess_exists:
                                            # print(dateSession)
                                            urlTxt = 'https://data.europarl.europa.eu/api/v1/plenary-session-documents?session=' + str(
                                                dateSession) + '&work-type=PLENARY_AGENDA_PART_SESSION_EP,PLENARY_AGENDA_EP,PLENARY_CRE_EP,PLENARY_MINUTES_EP,PLENARY_ATT_LIST_EP,PLENARY_VOTES_RESULTS_EP,PLENARY_RCV_EP&language=en' \
                                                               '&format=application%2Fld%2Bjson&offset=0'

                                            logger.info(
                                                'Url request for initial page with results:' + urlTxt + ' with option to run: ' + optionToRun)
                                            print(
                                                'Url request for initial page with results:' + urlTxt + ' with option to run: ' + optionToRun)
                                            url = requests.get(urlTxt, timeout=360)
                                            if url.status_code != 200:
                                                url = requests.get(urlTxt, timeout=360)
                                                print(url.status_code)
                                                if url.status_code == 200:
                                                    data = json.loads(url.text)
                                                    if data:
                                                        s = json.dumps(data)
                                                        open(yearFolder + '/sess_' + str(dateSession) + '.json', 'w').write(
                                                            s)
                                                        logger.info('Destination file ' + yearFolder + 'sess_' + str(
                                                            dateSession) + '.json')
                                                        time.sleep(3)
                                                    else:
                                                        logger.info('No data from query ' + yearFolder + 'sess_' + str(
                                                            dateSession) + '.json')
                                            else:
                                                data = json.loads(url.text)
                                                if data:
                                                    s = json.dumps(data)
                                                    open(yearFolder + '/sess_' + str(dateSession) + '.json', 'w').write(s)
                                                    logger.info('Destination file ' + yearFolder + 'sess_' + str(
                                                        dateSession) + '.json')
                                                    time.sleep(3)
                                                else:
                                                    logger.info('No data from query ' + yearFolder + 'sess_' + str(
                                                        dateSession) + '.json')
                                        else:
                                            logger.info(
                                                'The file:' + yearFolder + '/sess_' + str(dateSession) + '.json is been '
                                                                                                         'download '
                                                                                                         'already')
                            else:
                                data = json.loads(url.text)
                                if data:
                                    s = json.dumps(data)
                                    open(yearFolder + '/sess_' + str(dateSession) + '.json', 'w').write(s)
                                    logger.info('Destination file ' + yearFolder + 'sess_' + str(dateSession) + '.json')
                                    time.sleep(3)

                                else:
                                    logger.info('No data from query: ' + urlTxt)
                else:
                    logger.info('The file in folder :' + yearFolder + ' is been downloaded already')

            else:
                logger.info('The file page_' + str(curYear) + '.json is been download already')

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


def main():
    # test if the credentials given at the start of the script are correct
    if is_good_proxy(username, userpwd):
        if optionToRun != 'S':
            if currYear and startYear:
                valuesResult = urlCallListByYear(optionToRun, startYear, currYear)
                logger.info('result from download  function: {}'.format(valuesResult))
        else:
            valuesResult = urlCallListForSessions(optionToRun, meetingPathFolder)
            logger.info('result from download  function: {}'.format(valuesResult))


if __name__ != '__main__':
    pass
else:
    main()
