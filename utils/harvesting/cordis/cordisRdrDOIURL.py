import logging
import os
import time
from datetime import datetime
from os.path import exists
from urllib.parse import unquote
from getpass import getpass

from testProxy import is_good_proxy

import requests
# setting the source and destination folders
from bs4 import BeautifulSoup

# the following script downloads the pdf files related to the items in CORDIS

startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

externalDir = startDir + '/CORDIS/DOI/'
print('start dir' + startDir)

# getting current date to use later
now = datetime.now()
date_format = now.strftime("%Y%m%d")

username = input("insert your internet proxy username: ")
userpwd = getpass(prompt='insert your internet proxy password: ')

env_px = "http://" + username + ":" + userpwd + "@autoproxy.cec.eu.int:8012"
# set the environment variable HTTPS_PROXY with the value of variable env_px
os.environ["HTTPS_PROXY"] = env_px

# assignment of base folder, from where to start creating the folders,  if it does not exist then create it
base_folder = startDir + '/CORDIS/DOI/'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)

pathFolder = base_folder + 'downloadFiles/xmlFiles'
if not os.path.exists(pathFolder):
    os.makedirs(pathFolder)

# filename assignment of log folder
loggingFolder = externalDir + 'logs/logRdrDOI'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

if not os.path.exists(loggingFolder + '/failedDLDOIPdf.txt'):
    with open(loggingFolder + "/failedDLDOIPdf.txt", "w") as file:
        file.close()

# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/log" + date_time + ".txt")
# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()

# assignment of folder where to save the files, if it does not exist then create it
destFolder = externalDir + 'pdfFilesRelated'
if not os.path.exists(destFolder):
    os.makedirs(destFolder)

request_no = None
file_id = None
urlPdf = None
cls_names = []


# this function reads the txt file created in function downloadDOINumber and download the pdf file
def findRedirectURL(filename):
    with open(filename, encoding='utf-8') as file:
        rdrFileExists = exists(base_folder + 'redirect_urls_DOI.txt')
        if not rdrFileExists:
            with open(base_folder + 'redirect_urls_DOI.txt', 'w') as f:
                f.write('Filename\tDOI url\tredirect_url\n')
            f.close()
        while line := file.readline().rstrip():
            try:
                if "https://doi.org/10.3030/" not in line and 'DOI URL:' not in line:
                    # extracting the URL from the txt file
                    logger.info("reading line {}".format(line))
                    urlPart0F = line.partition('\t')[0].strip()
                    urlPart = line.partition('\t')[2].strip()
                    print(urlPart)
                    urlPartF = urlPart
                    if urlPartF:
                        with open(r'' + base_folder + 'redirect_urls_DOI.txt', 'r', encoding='utf-8') as filetst:
                            # read all content from txt file where the redirect URL's are saved
                            content = filetst.read()
                            # check if string present or not
                            if urlPart0F in content:
                                print('string exist {}'.format(urlPartF))
                                continue
                            else:
                                print('string does not exist {}'.format(urlPartF))
                        filetst.close()
                        # starting the download
                        headers = {
                            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
                                          'Chrome/86.0.4240.111 Safari/537.36'}
                        response = requests.get(urlPartF, headers=headers, allow_redirects=False, timeout=190)
                        print(response.status_code)
                        if response.status_code != 200:
                            if response.status_code == 404:
                                with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                    f.write(
                                        urlPart0F + '\t' + urlPartF + '\tError: ' + str(response.status_code) + '\n')
                                    time.sleep(1)
                            if response.status_code == 302:
                                soup = BeautifulSoup(response.content, features="lxml")
                                meta = soup.find_all('a')
                                if meta:
                                    for tag in meta:
                                        with open(base_folder + 'redirect_urls_DOI.txt', 'a',
                                                  encoding='utf-8') as f:
                                            f.write(urlPart0F + '\t' + urlPartF + '\t' + str(
                                                tag.text) + '\n')
                                            time.sleep(1)
                                        continue
                                else:
                                    logger.info('no meta was found, check {}'.format(resHeaders))
                                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                        f.write(urlPart0F + '\t' + urlPartF + '\tNOT FOUND ON meta, CHECK\n')
                                        time.sleep(1)
                                    continue
                            # Requests URL and get response object
                            elif response.status_code == 301:
                                resHeaders = response.headers
                                # print(response.headers)
                                index1 = str(resHeaders).index('\'location\': \'')
                                index2 = str(resHeaders).index('\', \'expires\'')
                                substringRed = str(resHeaders)[index1 + 13:index2]
                                if substringRed:
                                    print('rle found with expires {}'.format(substringRed))
                                    logger.info('rle found with expires {}'.format(substringRed))
                                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                        f.write(urlPart0F + '\t' + urlPartF + '\t' + unquote(substringRed) + '\n')
                                        time.sleep(1)
                                else:
                                    logger.info('no location was found, check {}'.format(resHeaders))
                                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                        f.write(urlPart0F + '\t' + urlPartF + '\tNOT FOUND ON HEADERS, CHECK\n')
                                        time.sleep(1)
                            else:
                                response = requests.get(urlPartF, allow_redirects=True, timeout=190)
                                print(response.status_code)
                                if response.status_code == 403 or response.status_code == 503:
                                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                        f.write(urlPart0F + '\t' + urlPartF + '\t' + unquote(
                                            response.url) + '\n')
                                        time.sleep(1)
                                    continue
                                else:
                                    soup = BeautifulSoup(response.content, features="lxml")
                                    meta = soup.find_all('meta')
                                    for tag in meta:
                                        if 'name' in tag.attrs.keys() and 'dc.identifier.uri' in tag.attrs['name'].strip().lower():
                                            print('NAME    :', tag.attrs['name'].lower())
                                            print('CONTENT :', tag.attrs['content'])
                                            with open(base_folder + 'redirect_urls_DOI.txt', 'a',
                                                      encoding='utf-8') as f:
                                                f.write(urlPart0F + '\t' + urlPartF + '\t' + str(
                                                    tag.attrs['content']) + '\n')
                                                time.sleep(1)
                                            continue
                        else:

                            resHeaders = response.headers
                            index1 = str(resHeaders).index('\'location\': \'')
                            index2 = str(resHeaders).index('\', \'vary\'')
                            substringRed = str(resHeaders)[index1 + 13:index2]
                            print('rle found with vary {}'.format(substringRed))
                            logger.info('rle found with vary {}'.format(substringRed))
                            if substringRed:
                                with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                    f.write(urlPart0F + '\t' + urlPartF + '\t' + unquote(substringRed) + '\n')
                                    time.sleep(1)
                            else:
                                logger.info('no location was found, check {}'.format(resHeaders))
                                with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                                    f.write(urlPart0F + '\t' + urlPartF + '\tNOT FOUND ON HEADERS, CHECK\n')
                                    time.sleep(1)
                                continue
            except requests.exceptions.ConnectionError:
                print("Site not rechable", urlPartF)
                response = requests.get(urlPartF, headers=headers, allow_redirects=True, timeout=190)
                print(response.url)
                if response.url:
                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                        f.write(urlPart0F + '\t' + urlPartF + '\t' + unquote(response.url) + '\n')
                        time.sleep(1)
                else:
                    with open(base_folder + 'redirect_urls_DOI.txt', 'a', encoding='utf-8') as f:
                        f.write(urlPart0F + '\t' + urlPartF + '\tSite not rechable\n')
                        time.sleep(1)
            except requests.ConnectionError as connect:
                print("ConnectionError {}".format(connect))
            except Exception as e:
                print("Got unhandled exception %s" % str(e))
                logger.info("Got unhandled exception %s" % str(e))
            # break


# launch of the script
def main():
    # test if the credentials given at the start of the script are correct
    if is_good_proxy(username, userpwd):
            print('pathFolder: ' + pathFolder)
            print('pathFolder: ' + base_folder)

            file_exists = os.path.exists((base_folder + 'urlsDOI.txt'))
            if file_exists:
                findRedirectURL(base_folder + 'urlsDOI.txt')

    if __name__ != '__main__':
        pass
    else:
        main()
