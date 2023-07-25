import logging
import os
from datetime import datetime
from getpass import getpass
import requests
from lxml import etree

from testProxy import is_good_proxy

# the following script search for the DOI reference number in the xml items files of CORDIS

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')

# set the environment variable HTTPS_PROXY with the value of variable env_px
env_px = "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"
os.environ["HTTPS_PROXY"] = env_px

# assignment of base folder, from where to start creating the folders, if it does not exist then is created
base_folder = startDir + '/DOI/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# declaration of folder where the xml files are located
pathFolder = startDir + '/CORDIS/downloadFiles/xmlFiles'

# assignment of log folder
loggingFolder = base_folder + 'logs/logDlDOI'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)
if not os.path.exists(loggingFolder + '/failedDLDOI.txt'):
    with open(loggingFolder + "/failedDLDOI.txt", "w") as file:
        file.close()


# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/log" + date_time + ".txt")
                    
# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()


# the following function filters the type of item that is read (e.g. project, result) and based on that
# executes a function that reads the xml file and search for the related DOI number, once the number is found,
# it creates a URL link with the number and save it to a txt file with the item to which is related and saved locally
def downloadDOINumber(filename):
    doiRef = None
    try:
        logger.info('reading file...{}'.format(filename))
        if not filename.endswith('.xml'): return
        fullname = os.path.join(pathFolder, filename)
        if 'project' in fullname:
            doiRef = findDoiRefInProject(fullname)
            typeItem = 'project'
        elif 'result' in fullname:
            doiRef = findDoiRefInResult(fullname)
            typeItem = 'project'

        else:
            logger.info('The following item does not have a DOI reference {}'.format(filename))
            return
        if not doiRef:
            logger.info('There is no DOI reference related to the item: {}'.format(filename))
        else:
            logger.info('The DOI reference is {}'.format(doiRef))
            baseURL = 'https://doi.org/'
            for singleData in doiRef:
                doiURL = baseURL + singleData
                with open(base_folder + 'urlsDOI.txt', 'a', encoding='utf-8') as f:
                    f.write(filename + '\t' + doiURL + '\n')

    except IndexError as ierr:
        return logger.info('error: {}'.format(ierr))
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


# this function reads the xml file and looks for the related DOI reference number in item of type project
def findDoiRefInProject(xmlFile):
    print('xml project file {}'.format(xmlFile))
    resultsDOI = []
    parser = etree.XMLParser(ns_clean=True)
    tree = etree.parse(xmlFile, parser)
    etreeR = tree.getroot()  # this is the root
    logger.info('reading element: {}'.format(etreeR.tag))
    if etreeR.findall('.//{http://cordis.europa.eu}rcn'):
        logger.info('rcn project: {}'.format(etreeR.find('.//{http://cordis.europa.eu}rcn').text))
    if etreeR.findall('.//{http://cordis.europa.eu}identifiers'):
        for doi in etreeR.findall('.//{http://cordis.europa.eu}identifiers'):
            if doi.find('.//{http://cordis.europa.eu}grantDoi') is not None:
                doiRef = doi.find('.//{http://cordis.europa.eu}grantDoi').text
                print('doi reference: {}'.format(doi.find('.//{http://cordis.europa.eu}grantDoi').text))
                logger.info('doi reference: {}'.format(doi.find('.//{http://cordis.europa.eu}grantDoi').text))
                resultsDOI.append(doiRef)
    return resultsDOI


# this function reads the xml file and looks for the related DOI reference number in item of type result
def findDoiRefInResult(xmlFile):
    print('xml result file {}'.format(xmlFile))
    parser = etree.XMLParser(ns_clean=True)
    resultsDoiRef = []
    tree = etree.parse(xmlFile, parser)
    etreeR = tree.getroot()  # this is the root
    logger.info('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    if len(etreeR.findall('.//{http://cordis.europa.eu}rcn')):
        rcnResult = etreeR.find('.//{http://cordis.europa.eu}rcn').text
    if etreeR.findall('.//{http://cordis.europa.eu}identifiers'):
        for doi in etreeR.findall(
                './/{http://cordis.europa.eu}identifiers'):
            if doi.find('.//{http://cordis.europa.eu}doi') is not None:
                doiRef = doi.find('.//{http://cordis.europa.eu}doi').text
                print('doi reference: {}'.format(doi.find('.//{http://cordis.europa.eu}doi').text))
                logger.info('doi reference: {}'.format(doi.find('.//{http://cordis.europa.eu}doi').text))
                resultsDoiRef.append(doiRef)

    return resultsDoiRef


# launch of the script through main()
def main():
    if is_good_proxy(username, userpwd):
        if not os.path.exists(pathFolder):
            print('the folder with the xml result items does not exists {}, please verify'.format(pathFolder))
        else:
            print('pathFolder: ' + pathFolder)
            with open(base_folder + 'urlsDOI.txt', 'w') as f:
                f.write('List of DOI \'s: \n')
                f.write('Filename:\tDOI URL:\n')
                f.close()
                for filename in os.listdir(pathFolder):
                    logger.info('reading file {}'.format(filename))
                    downloadDOINumber(filename)


if __name__ != '__main__':
    pass
else:
    main()
