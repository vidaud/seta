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

# the following script read all the xml file of items of type "article" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsArticles.txt file

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


# the following function read all the xml file of items of type "article" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsArticles.txt file
def statisticsArticle():
    countProjectRegionsColl = 0
    countProjectSource = 0
    countProjectAssoc = 0
    countPublicUrl = 0
    arrElemRegions = []
    arrElementRegions = []
    lstTagCodeCat = []
    arrCatAttr = []
    arrAssocOrgAttr = []
    arrElemProgramme = []
    arrFrameWProgramme = []
    arrElemProject = []
    arrElemCall = []
    countArticle = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsArticles.txt'):
        with open(startDir + '/CORDIS/statisticsArticles.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsArticles.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'article' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countArticle += 1
            parser = etree.XMLParser(ns_clean=True)
            tree = etree.parse(filenamepath, parser)

            etreeR = tree.getroot()  # this is the root

            # count the category attributes
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}categories/{http://cordis.europa.eu}category'):
                arrCatAttr.append(element.attrib)

            # to count the associations/organizations  attributes
            countProjectAssoc += len(etreeR.findall('.//{http://cordis.europa.eu}associations'))
            for element in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}organization'):
                arrAssocOrgAttr.append(element.attrib)

            # region attributes
            for region in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}regions/{http://cordis.europa.eu}region'):
                arrElemRegions.append(region.attrib)

            # counting the number of Articles with public URL
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
                arrElementRegions.append(tagRegionNameValue.text)

            # programme attribute
            for programme in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme'):
                arrElemProgramme.append(programme.attrib)

            # frameworkProgramme name
            tagframeworkProgrNameValue = etreeR.find(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme/{http://cordis.europa.eu}frameworkProgramme')
            if tagframeworkProgrNameValue is not None:
                arrFrameWProgramme.append(tagframeworkProgrNameValue.text)

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
    numpResultOrgAttr = numpy.array(lstResultOrgAttr)

    lstResultRegions = []
    for elem in arrElemRegions:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultRegions.append(datal)
    numpResultRegions = numpy.array(lstResultRegions)

    lstResultProgAttr = []
    for elem in arrElemProgramme:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultProgAttr.append(datal)
    numpResultProgAttr = numpy.array(lstResultProgAttr)

    lstResultProjectAttr = []
    for elem in arrElemProject:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultProjectAttr.append(datal)
    numpResultProjectAttr = numpy.array(lstResultProjectAttr)

    lstResultCallAttr = []
    for elem in arrElemCall:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultCallAttr.append(datal)
    numpResultCallAttr = numpy.array(lstResultCallAttr)

    # writing the arrays into file
    with open(startDir + '/CORDIS/statisticsArticles.txt', 'a', encoding="utf-8") as a:
        a.write('Article details:\n')
        logger.info('writing Article details')
        if arrElementRegions:
            countlstRegionName = dict(Counter(arrElementRegions))
            orderRegionDict = collections.OrderedDict(sorted(countlstRegionName.items()))
            a.write('\tRegions list:\n')
            logger.info('writing Regions list')
            for y in orderRegionDict:
                a.write("\t\t  {}.......... {} \n".format(y, orderRegionDict[y]))

        if numpResultOrgAttr.size > 0:
            newDicOrgAttr = Convert(numpResultOrgAttr)
            a.write('\n\tOrganizations attributes:\n')
            logger.info('writing Organizations attributes')
            for i in newDicOrgAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicOrgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\tCount of {str(item).replace(')', '')}: {newDicOrgAttr[i].count(item)}\n")

        if numpResultRegions.size > 0:
            newDicRegAttr = Convert(numpResultRegions)
            a.write('\n\tRegions attributes:\n')
            logger.info('writing Regions attributes')
            for i in newDicRegAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicRegAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicRegAttr[i].count(item)}\n")

        if numpCatAttr.size > 0:
            newDicCatAttr = Convert(numpCatAttr)
            a.write('\n\tCategory attributes:\n')
            logger.info('writing Category attributes')
            for i in newDicCatAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicCatAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicCatAttr[i].count(item)}\n")

        if numpResultProgAttr.size > 0:
            newDicProgAttr = Convert(numpResultProgAttr)
            a.write('\n\tProgramme attributes:\n')
            logger.info('writing Programme attributes')
            for i in newDicProgAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicProgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {str(item).replace(')', '')}: {newDicProgAttr[i].count(item)}\n")

        if arrFrameWProgramme:
            countlstFrameWProgramme = dict(Counter(arrFrameWProgramme))
            orderFrameworkProgramDict = collections.OrderedDict(sorted(countlstFrameWProgramme.items()))
            a.write('\n\t\tFramework Programme list:\n')
            logger.info('writing Framework attributes')
            for y in orderFrameworkProgramDict:
                a.write("\t\t\t{}.......... {} \n".format(y, orderFrameworkProgramDict[y]))

        if numpResultProjectAttr.size > 0:
            newDicProjectAttr = Convert(numpResultProjectAttr)
            # print('dict {}'.format(newDicProgAttr))
            a.write('\n\tProject attributes:\n')
            logger.info('writing Project attributes')
            for i in newDicProjectAttr:
                # print(i, newDicProgAttr[i])
                # print(newDicProgAttr.values())
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicProjectAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    # print(f"Count of {item} in tuple t: {newDicProgAttr[i].count(item)}")
                    a.write(f"\t\t\tCount of {item}: {newDicProjectAttr[i].count(item)}\n")

        if numpResultCallAttr.size > 0:
            newDicCallAttr = Convert(numpResultCallAttr)
            # print('dict {}'.format(newDicProgAttr))
            a.write('\n\tCall attributes:\n')
            logger.info('writing Call attributes')
            for i in newDicCallAttr:
                # print(i, newDicProgAttr[i])
                # print(newDicProgAttr.values())
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicCallAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    # print(f"Count of {item} in tuple t: {newDicProgAttr[i].count(item)}")
                    a.write(f"\t\t\tCount of {item}: {newDicCallAttr[i].count(item)}\n")

        a.write('\n\tNumber of articles in CORDIS: {} \n'.format(countArticle))

        if countPublicUrl:
            percentageArticleswithURL = countPublicUrl / countArticle
            a.write('\n\tNumber of articles with an assigned URL: {} \n'.format(countPublicUrl))
            a.write(
                '\n\tPercentage of articles with URL assigned from all articles in CORDIS: {:.3%} \n'.format(
                    percentageArticleswithURL))
            logger.info('writing Number of articles with an assigned URL')
        percentageResults = countArticle / totalFiles
        if percentageResults:
            a.write('\n\tTotal number of items in CORDIS: {} \n'.format(totalFiles))
            a.write('\n\tPercentage of articles in CORDIS: {:.3%} \n\n\n'.format(percentageResults))
            logger.info('writing Percentage of articles')
    a.close()
