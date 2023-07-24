import logging
import os
from datetime import datetime
from getpass import getpass
from os.path import exists

import requests
from bs4 import BeautifulSoup
from lxml import etree

from testProxy import is_good_proxy

# the following script downloads the pdf files related to the items in CORDIS

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
externalDir = 'D:/SeTA/CORDIS/'
print('start dir' +startDir)
os.chdir('D:')
# print(os.listdir(externalDir))

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

# declaration of input variables to run the script
username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')

# setting the proxy
env_px = "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"

# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ["HTTPS_PROXY"] = env_px

# assignment of base folder, from where to start creating the folders,  if it does not exist then is created
base_folder = startDir + '/CORDIS/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

# assignment of folder where to save the files, if it does not exist then is created
pathFolder = base_folder + 'downloadFiles/xmlFiles'
if not os.path.exists(pathFolder):
    os.makedirs(pathFolder)

# assignment of log folder
loggingFolder = externalDir + 'logs/logDownloadPdf'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)
if not os.path.exists(loggingFolder + '/failedPdf.txt'):
    with open(loggingFolder + "/failedPdf.txt", "w") as file:
        file.close()

# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/log" + date_time + ".txt")
# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()

# assignment of folder where to save the files, if it does not exist then is created
destFolder = externalDir + 'pdfFilesRelated'
if not os.path.exists(destFolder):
    os.makedirs(destFolder)

request_no = None
file_id = None
urlPdf = None
cls_names = []


# the following function filters the type of item that is read (e.g. project, result, article) and based on that
# executes a function that reads the xml file and search for the related pdf files, once the link to the pdf is found
# then is saved locally
def download_pdf_files(filename):
    chunk_size = 2000
    urlLink = None
    sessionwebLink = None
    try:
        logger.info('reading file...{}'.format(filename))
        if not filename.endswith('.xml'): return
        fullname = os.path.join(pathFolder, filename)
        if 'project' in fullname:
            urlLink = findWebLinkProject(fullname)
            typeItem = 'project'
        elif 'result' in fullname:
            urlLink = findWebLinkResult(fullname)
            typeItem = 'project'
        elif 'article' in fullname:
            urlLink = findWebLinkArticle(fullname)
            typeItem = 'article'
        else:
            logger.info('The following item does not have a url link {}'.format(filename))
            return
        if not urlLink:
            logger.info('There is no urlink to a pdf file related to the project: {}'.format(filename))
        else:
            logger.info('The founded results of url links are {}'.format(urlLink))
            for singleData in urlLink:
                logger.info(
                    destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[3] + '_webLinkId_' +
                    singleData[
                        1] + '.pdf')
                file_exists = exists(
                    destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[3] + '_webLinkId_' +
                    singleData[
                        1] + '.pdf')
                if not file_exists:
                    if 'result' in fullname:
                        if not singleData[4]:
                            print('there is no project related to the result {}'.format(fullname))
                            typeItem = 'result'
                    if 'ec.europa.eu/research' in singleData[0]:
                        print('there is an urlLink from ec.europa.eu related to the {} : {}'.format(typeItem,
                                                                                                    singleData[0]))
                        logger.info('there is an urlLink from ec.europa.eu related to the {} : {}'.format(typeItem,
                                                                                                          singleData[
                                                                                                              0]))
                        sessionwebLink = requests.Session()
                        response = sessionwebLink.get(singleData[0], timeout=120)
                        cookiesTst = sessionwebLink.cookies.get_dict()
                        soup = BeautifulSoup(response.text, 'html.parser')
                        # logger.info('this what I found in the first page: {}\n'.format(soup))
                        for x in soup.find_all('script'):
                            if x.text:
                                # logger.info('text found in script of the download url {}'.format(x.text))
                                attachUrl = x.text.replace('$(\'document\').ready(function(){', '')
                                attachUrl = attachUrl.replace('});', '')
                                attachUrl = attachUrl.replace('	window.location=\'', '')
                                attachUrl = attachUrl.replace('\';', '')
                                attachUrl = attachUrl.strip()
                                if 'attachment' in attachUrl:
                                    print('found the download attach url {}'.format(attachUrl))
                                    logger.info('found the download attach url {}'.format(attachUrl))
                                    r = sessionwebLink.get(attachUrl, timeout=120, cookies=cookiesTst)
                                    print('status code of request url of attach {}'.format(r.status_code))
                                    logger.info('status code of request url of attach {}'.format(r.status_code))
                                    if r.status_code == 200:
                                        with open(
                                                destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' +
                                                singleData[
                                                    3] + '_webLinkId_' +
                                                singleData[1] + '.pdf', 'wb') as fd:
                                            for chunk in r.iter_content(chunk_size):
                                                fd.write(chunk)
                                        logger.info('file saved as {}'.format(
                                            destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[
                                                3] + '_webLinkId_' +
                                            singleData[1] + '.pdf'))
                    else:
                        print('there is an urlLink related to the {} : {}'.format(typeItem, singleData[0]))
                        logger.info('there is an urlLink related to the {} : {}'.format(typeItem, singleData[0]))
                        sessionwebLink = requests.Session()
                        response = sessionwebLink.get(singleData[0], timeout=120)
                        print('status code of request url of attach {}'.format(response.status_code))
                        logger.info('status code of request url of attach {}'.format(response.status_code))
                        if response.status_code == 200:
                            with open(
                                    destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[
                                        3] + '_webLinkId_' +
                                    singleData[1] + '.pdf', 'wb') as fd:
                                for chunk in response.iter_content(chunk_size):
                                    fd.write(chunk)
                                logger.info('file saved as {}'.format(
                                    destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[
                                        3] + '_webLinkId_' +
                                    singleData[1] + '.pdf'))
                else:
                    logger.info('The file {} already exists'.format(
                        destFolder + '/' + typeItem + '_rcn_' + singleData[2] + '_' + singleData[3] + '_webLinkId_' +
                        singleData[1] + '.pdf'))

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
        # catastrophic error. bail.
        logger.info("RequestException:{}".format(err))
        return err


# this function reads the xml file and looks for the related weblink in item of type project
def findWebLinkProject(xmlFile):
    rcnCurrProject = None
    idWebLink = None
    urlLink = None
    resultsWebLinks = []
    parser = etree.XMLParser(ns_clean=True)
    tree = etree.parse(xmlFile, parser)
    etreeR = tree.getroot()  # this is the root
    typeofObject = etreeR.tag
    print('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    logger.info('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    if len(etreeR.findall('.//{http://cordis.europa.eu}rcn')):
        rcnCurrProject = etreeR.find('.//{http://cordis.europa.eu}rcn').text
        print('rcn project: {}'.format(etreeR.find('.//{http://cordis.europa.eu}rcn').text))
        logger.info('rcn project: {}'.format(etreeR.find('.//{http://cordis.europa.eu}rcn').text))
    if etreeR.findall(
            './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{'
            'http://cordis.europa.eu}result/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations'):
        for element in etreeR.findall(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{'
                'http://cordis.europa.eu}result/{http://cordis.europa.eu}relations/{'
                'http://cordis.europa.eu}associations'):
            if element.findall('.//{http://cordis.europa.eu}webLink'):
                for details in element.findall('.//{http://cordis.europa.eu}webLink'):
                    typeofElement = details.attrib['type']
                    if element.findall('.//{http://cordis.europa.eu}physUrl'):
                        urlLink = details.find('.//{http://cordis.europa.eu}physUrl').text
                        if 'relatedWebsite' not in typeofElement:
                            idWebLink = details.find('.//{http://cordis.europa.eu}id').text
                            if urlLink and idWebLink and rcnCurrProject:
                                singleResult = [urlLink, idWebLink, rcnCurrProject, typeofElement]
                                resultsWebLinks.append(singleResult)
                                singleResult = []
                        else:
                            logger.info('The type of urlLink is a website not a file {}'.format(urlLink))
                    else:
                        logger.info('There is no physUrl related {}'.format(details))
            else:
                logger.info('There is no weblink related {}'.format(element))
    return resultsWebLinks


# this function reads the xml file and looks for the related weblink in item of type result
def findWebLinkResult(xmlFile):
    parser = etree.XMLParser(ns_clean=True)
    resultsWebLinks = []
    tree = etree.parse(xmlFile, parser)
    etreeR = tree.getroot()  # this is the root
    typeofObject = etreeR.tag
    rcnCurrProject = None
    rcnResult = None
    isProject = False
    print('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    logger.info('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    if len(etreeR.findall('.//{http://cordis.europa.eu}rcn')):
        rcnResult = etreeR.find('.//{http://cordis.europa.eu}rcn').text

    if len(etreeR.findall(
            './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{'
            'http://cordis.europa.eu}project')):
        for project in etreeR.findall(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{'
                'http://cordis.europa.eu}project'):
            rcnCurrProject = project.find('.//{http://cordis.europa.eu}rcn').text
            print('rcn project: {}'.format(project.find('.//{http://cordis.europa.eu}rcn').text))
            logger.info('rcn project: {}'.format(project.find('.//{http://cordis.europa.eu}rcn').text))
    if etreeR.findall(
            './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations'):
        for element in etreeR.findall(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations'):
            if element.findall('.//{http://cordis.europa.eu}webLink'):
                for details in element.findall('.//{http://cordis.europa.eu}webLink'):
                    typeofElement = details.attrib['type']
                    if element.findall('.//{http://cordis.europa.eu}physUrl'):
                        urlLink = details.find('.//{http://cordis.europa.eu}physUrl').text
                        if 'relatedWebsite' not in typeofElement:
                            if element.findall('.//{http://cordis.europa.eu}id'):
                                idWebLink = details.find('.//{http://cordis.europa.eu}id').text
                                if urlLink and idWebLink and rcnCurrProject is not None:
                                    isProject = True
                                    singleResult = [urlLink, idWebLink, rcnCurrProject, typeofElement, isProject]
                                    resultsWebLinks.append(singleResult)
                                    singleResult = []
                                elif rcnCurrProject is None:
                                    singleResult = [urlLink, idWebLink, rcnResult, typeofElement, isProject]
                                    resultsWebLinks.append(singleResult)
                                    singleResult = []
                        else:
                            logger.info('The type of urlLink is a website not a file {}'.format(urlLink))
                    else:
                        logger.info('There is no physUrl related {}'.format(details))
            else:
                logger.info('There is no webLink related {}'.format(element))
    return resultsWebLinks


# this function reads the xml file and looks for the related weblink in item of type article
def findWebLinkArticle(xmlFile):
    rcnCurrArticle = None
    parser = etree.XMLParser(ns_clean=True)
    resultsWebLinks = []
    tree = etree.parse(xmlFile, parser)
    etreeR = tree.getroot()  # this is the root
    typeofObject = etreeR.tag
    print('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    logger.info('reading element: {}'.format(etreeR.tag))  # this is the element we are reading
    if len(etreeR.findall('.//{http://cordis.europa.eu}rcn')):
        rcnCurrArticle = etreeR.find('.//{http://cordis.europa.eu}rcn').text
        print('rcn article: {}'.format(etreeR.find('.//{http://cordis.europa.eu}rcn').text))
        logger.info('rcn article: {}'.format(etreeR.find('.//{http://cordis.europa.eu}rcn').text))
    if etreeR.findall(
            './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations'):
        for element in etreeR.findall(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations'):
            if element.findall('.//{http://cordis.europa.eu}webLink'):
                for details in element.findall('.//{http://cordis.europa.eu}webLink'):
                    typeofElement = details.attrib['type']
                    if element.findall('.//{http://cordis.europa.eu}physUrl'):
                        urlLink = details.find('.//{http://cordis.europa.eu}physUrl').text
                        if 'formatPdf' in typeofElement:
                            idWebLink = details.find('.//{http://cordis.europa.eu}id').text
                            if urlLink and idWebLink and rcnCurrArticle:
                                singleResult = [urlLink, idWebLink, rcnCurrArticle, typeofElement]
                                resultsWebLinks.append(singleResult)
                                singleResult = []
                        else:
                            logger.info('The type of urlLink is not a formatPdf {}'.format(urlLink))
                    else:
                        logger.info('There is no physUrl {}'.format(details))
            else:
                logger.info('There is no webLink {}'.format(element))

    return resultsWebLinks


# launch of the script
def main():
    # test if the credentials given at the start of the script are correct
    if is_good_proxy(username, userpwd):
        print('pathFolder: ' + pathFolder)
        for filename in os.listdir(pathFolder):
            logger.info('reading file {}'.format(filename))
            download_pdf_files(filename)


if __name__ != '__main__':
    pass
else:
    main()
