import collections
import fnmatch
import logging
import os
import os.path
from collections import Counter
from collections import deque
from datetime import datetime
from statsFunctions import Convert
import numpy
from lxml import etree

# the following script read all the xml file of items of type "result" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, then calls
# and writes to statisticsResults.txt file

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


# the following function read all the xml file of items of type "result" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, then calls
# and writes to statisticsResults.txt file
def statisticsResult():
    countProjectRegionsColl = 0
    countProjectSource = 0
    countProjectAssoc = 0
    countPublicUrl = 0
    elementRegions = []
    lstTagCodeCat = []
    arrCatAttr = deque()
    arrAssocOrgAttr = []
    arrProgrammeAttr = []
    elementFrameWProgramme = []
    arrElemProject = []
    arrElemCall = []
    countResult = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsResults.txt'):
        with open(startDir + '/CORDIS/statisticsResults.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsResults.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'result' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countResult += 1
            parser = etree.XMLParser(ns_clean=True)
            tree = etree.parse(filenamepath, parser)

            etreeR = tree.getroot()  # this is the root

            # count the category attributes
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}categories/{http://cordis.europa.eu}category'):
                arrCatAttr.append(element.attrib)

            # to count the associations/organizations attributes
            countProjectAssoc += len(etreeR.findall('.//{http://cordis.europa.eu}associations'))
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}organization'):
                arrAssocOrgAttr.append(element.attrib)

            # number of results with assigned url
            countPublicUrl += len(etreeR.findall('.//{http://cordis.europa.eu}public_url'))

            # categories source
            categoriesSource = etreeR.findall(
                './/{http://cordis.europa.eu}category[@classification="source"]/{http://cordis.europa.eu}code')
            for item in categoriesSource:
                lstTagCodeCat.append(item.text)

            countProjectRegionsColl += len(
                etreeR.findall('.//{http://cordis.europa.eu}category[@classification="collection"]'))
            countProjectSource += len(etreeR.findall('.//{http://cordis.europa.eu}category[@classification="source"]'))

            # regions name
            tagRegionNameValue = etreeR.find(
                './/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}organization/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}regions/{http://cordis.europa.eu}region/{http://cordis.europa.eu}name')
            if tagRegionNameValue is not None:
                elementRegions.append(tagRegionNameValue.text)

            # programme attribute
            for programme in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme'):
                arrProgrammeAttr.append(programme.attrib)

            # frameworkProgramme name
            tagframeworkProgrNameValue = etreeR.find(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme/{http://cordis.europa.eu}frameworkProgramme')
            if tagframeworkProgrNameValue is not None:
                elementFrameWProgramme.append(tagframeworkProgrNameValue.text)

            # project attribute
            for project in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}project'):
                arrElemProject.append(project.attrib)

            # call attribute
            for call in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}call'):
                arrElemCall.append(call.attrib)

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
    numpAssocOrgAttr = numpy.array(lstResultOrgAttr)

    lstResultProgAttr = []
    for elem in arrProgrammeAttr:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultProgAttr.append(datal)
    numpProgAttr = numpy.array(lstResultProgAttr)

    lstResultProjectAttr = []
    for elem in arrElemProject:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultProjectAttr.append(datal)
    numpProjectAttr = numpy.array(lstResultProjectAttr)

    lstResultCallAttr = []
    for elem in arrElemCall:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultCallAttr.append(datal)
    numpCallAttr = numpy.array(lstResultCallAttr)

    # writing the arrays into file
    with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
        a.write('Result details:\n')
        logger.info('writing Result details')
        if elementRegions:
            countlstRegionName = dict(Counter(elementRegions))
            orderRegionDict = collections.OrderedDict(sorted(countlstRegionName.items()))
            a.write('\tRegions list:\n')
            logger.info('writing Regions list')
            for y in orderRegionDict:
                a.write("\t\t  {}.......... {} \n".format(y, orderRegionDict[y]))
        a.close()

    if numpCatAttr.size > 0:
        newDicCatAttr = Convert(numpCatAttr)
        with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tCategory attributes:\n')
            logger.info('writing Category attributes')
            for i in newDicCatAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '')))
                unique_t = set(newDicCatAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{str(item).replace(')', '')}\' : {newDicCatAttr[i].count(item)}\n")
        a.close()
    if numpAssocOrgAttr.size > 0:
        newDicAssocOrgAttr = Convert(numpAssocOrgAttr)
        with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tAssociations - Organizations attributes:\n')
            logger.info('writing associations/organizations attributes')
            for i in newDicAssocOrgAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicAssocOrgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicAssocOrgAttr[i].count(item)}\n")
        a.close()

    if numpProgAttr.size > 0:
        newDicProgAttr = Convert(numpProgAttr)
        with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tProgramme attributes:\n')
            logger.info('writing Programme attributes')
            for i in newDicProgAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicProgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(
                        f"\t\t\tCount of {str(item).replace(')', '').replace(',', '')}: {newDicProgAttr[i].count(item)}\n")
        a.close()

        if elementFrameWProgramme:
            countlstFrameWProgramme = dict(Counter(elementFrameWProgramme))
            orderFrameworkProgramDict = collections.OrderedDict(sorted(countlstFrameWProgramme.items()))
            with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tFramework Programme list:\n')
                logger.info('writing Framework Programme list')
                for y in orderFrameworkProgramDict:
                    a.write("\t\t{}.......... {} \n".format(y, orderFrameworkProgramDict[y]))
            a.close()

        if numpProjectAttr.size > 0:
            newDicProjectAttr = Convert(numpProjectAttr)
            with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tProject attributes:\n')
                logger.info('writing Project attributes')
                for i in newDicProjectAttr:
                    a.write('\n\t\t{}:\n'.format(i))
                    unique_t = set(newDicProjectAttr[i])
                    # count of each element in tuple
                    for item in unique_t:
                        a.write(f"\t\t\tCount of {item}: {newDicProjectAttr[i].count(item)}\n")
            a.close()

        if numpCallAttr.size > 0:
            newDicCallAttr = Convert(numpCallAttr)
            with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tCall attributes:\n')
                logger.info('writing Call attributes')
                for i in newDicCallAttr:
                    a.write('\n\t\t{}:\n'.format(i))
                    unique_t = set(newDicCallAttr[i])
                    # count of each element in tuple
                    for item in unique_t:
                        a.write(f"\t\t\tCount of {item}: {newDicCallAttr[i].count(item)}\n")
            a.close()

        with open(startDir + '/CORDIS/statisticsResults.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tNumber of results in CORDIS: {} \n'.format(countResult))
            if countPublicUrl:
                percentageResultswithURL = countPublicUrl / countResult
                a.write('\n\tNumber of results with an assigned URL: {} \n'.format(countPublicUrl))
                a.write(
                    '\n\tPercentage of results with URL assigned from all results in CORDIS: {:.3%} \n'.format(
                        percentageResultswithURL))
                logger.info('writing Number of projects with an assigned URL')
            percentageResults = countResult / totalFiles
            if percentageResults:
                a.write('\n\tTotal number of items in CORDIS: {} \n'.format(totalFiles))
                a.write('\n\tPercentage of results: {:.3%} \n\n\n'.format(percentageResults))
                logger.info('writing Percentage of results')
        a.close()
