import collections
import fnmatch
import logging
import os
import os.path
from collections import Counter
from datetime import datetime
from statsFunctions import Convert
import numpy
from lxml import etree

# the following script read all the xml file of items of type "project" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsProjects.txt file

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


# the following function read all the xml file of items of type "project" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsProjects.txt file
def statisticsProject():
    countProjectRegionsColl = 0
    countProjectSource = 0
    countProjectAssoc = 0
    countProjectOrg = 0
    countPublicUrl = 0
    arrElemRegions = []
    elementRegions = []
    lstTagCodeCat = []
    arrCatAttr = []
    arrAssocOrgAttr = []
    arrElemProgramme = []
    elementFrameWProgramme = []
    arrElemArticle = []
    arrElemCall = []
    countProject = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsProjects.txt'):
        with open(startDir + '/CORDIS/statisticsProjects.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsProjects.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'project' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countProject += 1
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
                if str(element.attrib).isdigit():
                    element.attrib = str(element.attrib).replace(",", '.')
                attributeEle = element.attrib
                arrAssocOrgAttr.append(attributeEle)

            # region attributes
            for region in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}regions/{http://cordis.europa.eu}region'):
                arrElemRegions.append(region.attrib)

            # number of projects with assigned url
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
                arrElemProgramme.append(programme.attrib)

            # frameworkProgramme name
            tagframeworkProgrNameValue = etreeR.find(
                './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme/{http://cordis.europa.eu}frameworkProgramme')
            if tagframeworkProgrNameValue is not None:
                elementFrameWProgramme.append(tagframeworkProgrNameValue.text)

            # article attribute
            for article in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}article'):
                arrElemArticle.append(article.attrib)

            # call attribute
            for call in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}call'):
                arrElemCall.append(call.attrib)

    lstResultCategAttr = []
    for elem in arrCatAttr:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultCategAttr.append(datal)
    numpCatAttr = numpy.array(lstResultCategAttr)

    lstResultOrgAttr = []
    for elem in arrAssocOrgAttr:
        logger.info('elemento {}'.format(elem))
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

    lstResultArtcAttr = []
    for elem in arrElemArticle:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultArtcAttr.append(datal)
    numpResultArtcAttr = numpy.array(lstResultArtcAttr)

    lstResultCallAttr = []
    for elem in arrElemArticle:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultCallAttr.append(datal)
    numpResultCallAttr = numpy.array(lstResultCallAttr)

    # start writing result into txt file
    with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
        a.write('Project details:\n')
        logger.info('writing Project details')
        if elementRegions:
            countlstRegionName = dict(Counter(elementRegions))
            orderRegionDict = collections.OrderedDict(sorted(countlstRegionName.items()))
            a.write('\tRegions list:\n')
            logger.info('writing Regions list')
            for y in orderRegionDict:
                a.write("\t\t  {}.......... {} \n".format(y, orderRegionDict[y]))
    a.close()
    if numpResultOrgAttr.size > 0:
        newDicOrgAttr = Convert(numpResultOrgAttr)
        with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tOrganizations attributes:\n')
            logger.info('writing Organizations attributes')
        a.close()
        for i in newDicOrgAttr:
            if 'order' not in str(i):
                if 'ecContribution' not in str(i):
                    if 'netEcContribution' not in str(i):
                        if 'totalCost' not in str(i):
                            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                            a.close()
                            unique_t = set(newDicOrgAttr[i])
                            # count of each element in tuple
                            for item in unique_t:
                                with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                                    a.write(
                                        f"\t\t\tCount of {str(item).replace(')', '')}: {newDicOrgAttr[i].count(item)}\n")
                                a.close()

        if numpResultRegions.size > 0:
            newDicRegAttr = Convert(numpResultRegions)
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tRegions attributes:\n')
                for i in newDicRegAttr:
                    a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                    unique_t = set(newDicRegAttr[i])
                    # count of each element in tuple
                    for item in unique_t:
                        with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                            a.write(
                                f"\t\t\tCount of \'{str(item).replace(')', '')}\' : {newDicRegAttr[i].count(item)}\n")
                        a.close()

        if numpCatAttr.size > 0:
            newDicCatAttr = Convert(numpCatAttr)
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tCategory attributes:\n')
                logger.info('writing Category attributes')
            a.close()
            for i in newDicCatAttr:
                if 'order' not in str(i):
                    with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                        a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                    a.close()
                    unique_t = set(newDicCatAttr[i])
                    # count of each element in tuple
                    for item in unique_t:
                        with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                            a.write(
                                f"\t\t\tCount of \'{str(item).replace(')', '')}\' : {newDicCatAttr[i].count(item)}\n")
                        a.close()

        if numpResultProgAttr.size > 0:
            newDicProgAttr = Convert(numpResultProgAttr)
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tProgramme attributes:\n')
                logger.info('writing Programme attributes')
            a.close()
            for i in newDicProgAttr:
                with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                    a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                a.close()
                unique_t = set(newDicProgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                        a.write(f"\t\t\tCount of {str(item).replace(')', '')}: {newDicProgAttr[i].count(item)}\n")
                    a.close()

        if elementFrameWProgramme:
            countlstFrameWProgramme = dict(Counter(elementFrameWProgramme))
            orderFrameworkProgramDict = collections.OrderedDict(sorted(countlstFrameWProgramme.items()))
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tFramework Programme list:\n')
                logger.info('writing Framework Programme list')
            a.close()
            for y in orderFrameworkProgramDict:
                with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                    a.write("\t\t{}.......... {} \n".format(y, orderFrameworkProgramDict[y]))
                a.close()

        if numpResultArtcAttr.size > 0:
            newDicArtcAttr = Convert(numpResultArtcAttr)
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tArticle attributes:\n')
                logger.info('writing Article attributes')
                for i in newDicArtcAttr:
                    if 'order' not in i:
                        a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                        unique_t = set(newDicArtcAttr[i])
                        # count of each element in tuple
                        for item in unique_t:
                            a.write(f"\t\t\tCount of {str(item).replace(')', '')}: {newDicArtcAttr[i].count(item)}\n")
            a.close()

        if numpResultCallAttr.size > 0:
            newDicCallAttr = Convert(numpResultCallAttr)
            with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                a.write('\n\tCall attributes:\n')
                logger.info('writing Call attributes')
            a.close()
            for i in newDicCallAttr:
                if 'order' not in str(i):
                    with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                        a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                    a.close()
                    unique_t = set(newDicCallAttr[i])
                    # count of each element in tuple
                    for item in unique_t:
                        with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
                            a.write(f"\t\t\tCount of {str(item).replace(')', '')}: {newDicCallAttr[i].count(item)}\n")
                        a.close()

        with open(startDir + '/CORDIS/statisticsProjects.txt', 'a', encoding="utf-8") as a:
            a.write('\n\tTotal number of projects: {} \n'.format(countProject))

            if countPublicUrl:
                percentageProjectswithURL = countPublicUrl / countProject
                a.write('\n\tNumber of projects with an assigned URL: {} \n'.format(countPublicUrl))
                a.write(
                    '\n\tPercentage of projects with URL assigned from all projects in CORDIS: {:.3%} \n'.format(
                        percentageProjectswithURL))
                logger.info('writing Number of projects with an assigned URL')

            percentageProjects = countProject / totalFiles
            if percentageProjects:
                a.write('\n\tPercentage of projects present in total items from Cordis: {:.3%} \n\n\n'.format(
                    percentageProjects))
                logger.info('writing Percentage of projects')
        a.close()
