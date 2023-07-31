import collections
import fnmatch
import logging
import os
import os.path
from collections import Counter
from datetime import datetime
import numpy
from lxml import etree
from statsFunctions import Convert

# the following script read all the xml file of items of type "event" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsEvents.txt file

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# assignment of folder where to read the files
pathFolder = startDir + '/CORDIS/downloadFiles/xmlFiles'

# count the number of file that have the extension xml
totalFiles = len(fnmatch.filter(os.listdir(pathFolder), '*.xml'))

# setting a variable with current date
now = datetime.now()

# setting the date time variable with the format value
date_time = now.strftime("%Y%m%d%H%M%S")

# assignment of log folder if it does not exist then is created
loggingFolder = startDir + '/CORDIS/logs/logStats'
if not os.path.exists(loggingFolder):
    os.makedirs(loggingFolder)

print('logging folder {}'.format(loggingFolder))
# setting the log file name and the destination path for the logging function
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s",
                    filename=loggingFolder + "/logStats_" + date_time + ".txt")

# declaration variable logger that will be writing into the log txt file
logger = logging.getLogger()


# the following function read all the xml file of items of type "event" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsEvents.txt file
def statisticsEvent():
    countEventRegionsColl = 0
    countEventSource = 0
    countEventAssoc = 0
    countPublicUrl = 0
    arrElemRegions = []
    elementRegions = []
    lstTagCodeCat = []
    arrCatAttr = []
    arrAssocOrgAttr = []
    countEvent = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsEvents.txt'):
        with open(startDir + '/CORDIS/statisticsEvents.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsEvents.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'event' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countEvent += 1
            parser = etree.XMLParser(ns_clean=True)
            tree = etree.parse(filenamepath, parser)

            etreeR = tree.getroot()  # this is the root

            # count the category attributes
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}categories/{http://cordis.europa.eu}category'):
                arrCatAttr.append(element.attrib)

            # to count the associations/organizations  attributes
            countEventAssoc += len(etreeR.findall('.//{http://cordis.europa.eu}associations'))
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}organization'):
                arrAssocOrgAttr.append(element.attrib)

            # region attributes
            for region in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}regions/{http://cordis.europa.eu}region'):
                arrElemRegions.append(region.attrib)

            # number of events with assigned URL
            countPublicUrl += len(etreeR.findall('.//{http://cordis.europa.eu}public_url'))

            # categories source
            categoriesSource = etreeR.findall(
                './/{http://cordis.europa.eu}category[@classification="source"]/{http://cordis.europa.eu}code')
            for item in categoriesSource:
                lstTagCodeCat.append(item.text)

            countEventRegionsColl += len(
                etreeR.findall('.//{http://cordis.europa.eu}category[@classification="collection"]'))
            countEventSource += len(etreeR.findall('.//{http://cordis.europa.eu}category[@classification="source"]'))

            # regions name
            tagRegionNameValue = etreeR.find(
                './/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}organization/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}regions/{http://cordis.europa.eu}region/{http://cordis.europa.eu}name')
            if tagRegionNameValue is not None:
                elementRegions.append(tagRegionNameValue.text)

    # saving the result values from search into category arrays
    lstResultCategAttr = []
    for elem in arrCatAttr:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultCategAttr.append(datal)
    numpCatAttr = numpy.array(lstResultCategAttr)

    lstResultOrgAttr = []
    for elem in arrAssocOrgAttr:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultOrgAttr.append(datal)
    numpResultOrgAttr = numpy.array(lstResultOrgAttr)

    lstResultRegions = []
    for elem in arrElemRegions:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultRegions.append(datal)
    numpResultRegions = numpy.array(lstResultRegions)

    # writing the arrays into file
    with open(startDir + '/CORDIS/statisticsEvents.txt', 'a', encoding="utf-8") as a:
        logger.info('start writing some statistics Events details')
        a.write('Events details:\n')
        if elementRegions:
            countlstRegionName = dict(Counter(elementRegions))
            orderRegionDict = collections.OrderedDict(sorted(countlstRegionName.items()))
            a.write('\tRegions list:\n')
            for y in orderRegionDict:
                a.write("\t\t  {}.......... {} \n".format(y, orderRegionDict[y]))
            logger.info('writing Regions list')

        if numpResultOrgAttr.size > 0:
            newDicOrgAttr = Convert(numpResultOrgAttr)
            a.write('\n\tOrganizations attributes:\n')
            for i in newDicOrgAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicOrgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{str(item).replace(')', '')}\' : {newDicOrgAttr[i].count(item)}\n")
            logger.info('writing Organizations attribute')

        if numpResultRegions.size > 0:
            newDicRegAttr = Convert(numpResultRegions)
            a.write('\n\tRegions attributes:\n')
            for i in newDicRegAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicRegAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{str(item).replace(')', '')}\' : {newDicRegAttr[i].count(item)}\n")
            logger.info('writing Regions attributes')

        if numpCatAttr.size > 0:
            newDicCatAttr = Convert(numpCatAttr)
            a.write('\n\tCategories attributes:\n')
            for i in newDicCatAttr:
                a.write('\t\t{}:\n'.format(i))
                unique_t = set(newDicCatAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicCatAttr[i].count(item)}\n")
            logger.info('writing Categories attributes')

        a.write('\n\tNumber of events in CORDIS: {} \n'.format(countEvent))

        if countPublicUrl:
            percentageEventswithURL = countPublicUrl / countEvent
            a.write('\n\tNumber of events with an assigned URL: {} \n'.format(countPublicUrl))
            a.write(
                '\n\tPercentage of events with URL assigned from all articles in CORDIS: {:.3%} \n'.format(
                    percentageEventswithURL))
            logger.info('writing Number of events with an assigned URL')

        percentageEvents = countEvent / totalFiles
        if percentageEvents:
            a.write('\n\tTotal number of items in CORDIS: {} \n'.format(totalFiles))
            a.write('\n\tPercentage of events in CORDIS: {:.3%} \n\n'.format(percentageEvents))
            logger.info('writing Percentage of events')
    a.close()
