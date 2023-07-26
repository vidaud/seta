import collections
import fnmatch
import glob
import logging
import os
import os.path
from collections import Counter
from collections import deque
from datetime import datetime

import numpy
from lxml import etree

# the following script gives some statistics regarding the different types of items

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# assignment of folder where to read the files
pathFolder = startDir + '/CORDIS/downloadFiles/xmlFiles'

# count the number of file that have the extension xml
totalFiles = len(fnmatch.filter(os.listdir(pathFolder), '*.xml'))
print('Total number of files count {}:'.format(totalFiles))

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


# the following function counts all the different downloaded items (e.g. article, event, programme, project,
# publication, result), gives some percentage and write it to a txt file
def countingFilesTypes():
    articleCounter = len(glob.glob1(pathFolder, "article*.xml"))
    eventCounter = len(glob.glob1(pathFolder, "event*.xml"))
    programmeCounter = len(glob.glob1(pathFolder, "programme*.xml"))
    projectCounter = len(glob.glob1(pathFolder, "project*.xml"))
    publicationCounter = len(glob.glob1(pathFolder, "publication*.xml"))
    resultCounter = len(glob.glob1(pathFolder, "result*.xml"))

    logger.info('Number of projects: {}'.format(projectCounter))
    logger.info('Number of results: {}'.format(resultCounter))
    logger.info('Number of articles: {}'.format(articleCounter))
    logger.info('Number of publications: {}'.format(publicationCounter))
    logger.info('Number of events: {}'.format(eventCounter))
    logger.info('Number of programme: {}'.format(programmeCounter))

    totalFileswithUrl = len(fnmatch.filter(os.listdir(pathFolder), '*.xml'))
    logger.info('Files with url count {}:'.format(totalFileswithUrl))
    logger.info('percentage of projects: {:.3%}'.format(projectCounter / totalFiles))
    logger.info('percentage of results: {:.3%}'.format(resultCounter / totalFiles))
    logger.info('percentage of articles: {:.3%}'.format(articleCounter / totalFiles))
    logger.info('percentage of publications: {:.3%}'.format(publicationCounter / totalFiles))
    logger.info('percentage of events: {:.3%}'.format(eventCounter / totalFiles))
    logger.info('percentage of programme: {:.3%}'.format(programmeCounter / totalFiles))

    if not os.path.exists(startDir + '/CORDIS/stats'):
        os.makedirs(startDir + '/CORDIS/stats')
    if not os.path.exists(startDir + '/CORDIS/stats/output_lst_cordis_xml_file.txt'):
        with open(startDir + '/CORDIS/stats/output_lst_cordis_xml_file.txt', 'w') as file:
            file.close()
    with open(startDir + '/CORDIS/stats/output_lst_cordis_xml_file.txt', 'w') as a:
        a.write('Total files count {}:'.format(totalFiles) + '\n\n')

        a.write('Number of articles: {}'.format(articleCounter) + '\n')
        a.write('Number of events: {}'.format(eventCounter) + '\n')
        a.write('Number of programme: {}'.format(programmeCounter) + '\n')
        a.write('Number of projects: {}'.format(projectCounter) + '\n')
        a.write('Number of publications: {}'.format(publicationCounter) + '\n')
        a.write('Number of results: {}'.format(resultCounter) + '\n\n')

        a.write('percentage of articles present in the platform: {:.3%}'.format(articleCounter / totalFiles) + '\n')
        a.write('percentage of events present in the platform: {:.3%}'.format(eventCounter / totalFiles) + '\n')
        a.write('percentage of programme present in the platform: {:.3%}'.format(programmeCounter / totalFiles) + '\n')
        a.write('percentage of projects present in the platform: {:.3%}'.format(projectCounter / totalFiles) + '\n')
        a.write(
            'percentage of publications present in the platform: {:.3%}'.format(publicationCounter / totalFiles) + '\n')
        a.write('percentage of results present in the platform: {:.3%}'.format(resultCounter / totalFiles) + '\n')

    

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


# the following function read all the xml file of items of type "publication" and gives some statistics like the
# different type of regions, Organizations, Associations, Framework programme and also the related items like
# articles, call and writes to statisticsPublication.txt file
def statisticsPublication():
    countProjectRegionsColl = 0
    countProjectSource = 0
    countProjectAssoc = 0
    countPublicUrl = 0
    arrElemRegions = []
    arrelementRegions = []
    lstTagCodeCat = []
    arrCatAttr = []
    arrAssocOrgAttr = []
    arrElemProgramme = []
    elementFrameWProgramme = []
    arrElemProject = []
    arrElemCall = []
    countPublication = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsPublications.txt'):
        with open(startDir + '/CORDIS/statisticsPublications.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsPublications.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'publication' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countPublication += 1
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

            # count assigned URL
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
                arrelementRegions.append(tagRegionNameValue.text)

            # programme attribute
            for programme in etreeR.findall(
                    './/{http://cordis.europa.eu}relations/{http://cordis.europa.eu}associations/{http://cordis.europa.eu}programme'):
                arrElemProgramme.append(programme.attrib)

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
    numpResultCategAttr = numpy.array(lstResultCategAttr)

    lstResultOrgAttr = []
    for elem in arrAssocOrgAttr:
        newEle = dict(elem)
        res = newEle.items()
        # print('res {}'.format(res))
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
    with open(startDir + '/CORDIS/statisticsPublications.txt', 'a', encoding="utf-8") as a:
        a.write('Publication details:\n')
        logger.info('writing Publication details')
        if arrelementRegions:
            countlstRegionName = dict(Counter(arrelementRegions))
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

        if numpResultCategAttr.size > 0:
            newDicCatAttr = Convert(numpResultCategAttr)
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
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicProgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicProgAttr[i].count(item)}\n")

        if elementFrameWProgramme:
            countlstFrameWProgramme = dict(Counter(elementFrameWProgramme))
            orderFrameworkProgramDict = collections.OrderedDict(sorted(countlstFrameWProgramme.items()))
            a.write('\n\t\tFramework Programme list:\n')
            logger.info('writing Framework Programme list')
            for y in orderFrameworkProgramDict:
                a.write("\t\t\t{}.......... {} \n".format(y, orderFrameworkProgramDict[y]))

        if numpResultProjectAttr.size > 0:
            newDicProjectAttr = Convert(numpResultProjectAttr)
            a.write('\n\tProject attributes:\n')
            logger.info('writing Project attributes')
            for i in newDicProjectAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicProjectAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicProjectAttr[i].count(item)}\n")

        if numpResultCallAttr.size > 0:
            newDicCallAttr = Convert(numpResultCallAttr)
            a.write('\n\tCall attributes:\n')
            logger.info('writing Call attributes')
            for i in newDicCallAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicCallAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicCallAttr[i].count(item)}\n")

        a.write('\n\tNumber of publications in CORDIS: {} \n'.format(countPublication))
        if countPublicUrl:
            percentagePublicationswithURL = countPublicUrl / countPublication
            a.write('\n\tNumber of publications with an assigned URL: {} \n'.format(countPublicUrl))
            a.write(
                '\n\tPercentage of publications with URL assigned from all articles in CORDIS: {:.3%} \n'.format(
                    percentagePublicationswithURL))
            logger.info('writing Number of publication with an assigned URL')

        percentagePublication = countPublication / totalFiles
        if percentagePublication:
            a.write('\n\tTotal number of items in CORDIS: {} \n'.format(totalFiles))
            a.write('\n\tPercentage of publications in CORDIS: {:.3%} \n\n\n'.format(percentagePublication))
            logger.info('writing Percentage of publication')
    a.close()


# the following function read all the xml file of items of type "programme" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsProgramme.txt file
def statisticsProgramme():
    countProjectRegionsColl = 0
    countProjectSource = 0
    countProjectAssoc = 0
    countPublicUrl = 0
    arrElemRegions = []
    elementRegions = []
    lstTagCodeCat = []
    arrCatAttr = []
    arrAssocOrgAttr = []
    arrElemProgramme = []
    elementFrameWProgramme = []
    arrElemProject = []
    arrElemCall = []
    countProgramme = 0
    if not os.path.exists(startDir + '/CORDIS/statisticsProgramme.txt'):
        with open(startDir + '/CORDIS/statisticsProgramme.txt', 'w') as a:
            a.close()
    else:
        with open(startDir + '/CORDIS/statisticsProgramme.txt', 'w') as a:
            a.close()
    for filename in os.listdir(pathFolder):
        filenamepath = os.path.join(pathFolder, filename)
        if 'programme' in filenamepath:
            logger.info('Reading file {}'.format(filename))
            countProgramme += 1
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

            # count number of public URLS assigned
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
                './/{http://cordis.europa.eu}frameworkProgramme')
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
    numpResultCategAttr= numpy.array(lstResultCategAttr)

    lstResultOrgAttr = []
    for elem in arrAssocOrgAttr:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultOrgAttr.append(datal)
    numpResultOrgAttr= numpy.array(lstResultOrgAttr)

    lstResultRegions = []
    for elem in arrElemRegions:
        newEle = dict(elem)
        res = newEle.items()
        datal = list(res)
        lstResultRegions.append(datal)
    numpResultRegions= numpy.array(lstResultRegions)

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
    with open(startDir + '/CORDIS/statisticsProgramme.txt', 'a', encoding="utf-8") as a:
        a.write('Programme details:\n')
        if elementRegions:
            countlstRegionName = dict(Counter(elementRegions))
            orderRegionDict = collections.OrderedDict(sorted(countlstRegionName.items()))
            a.write('\tRegions list:\n')
            for y in orderRegionDict:
                a.write("\t\t  {}.......... {} \n".format(y, orderRegionDict[y]))

        if numpResultOrgAttr.size > 0:
            newDicOrgAttr = Convert(numpResultOrgAttr)
            a.write('\n\tOrganizations attributes:\n')
            for i in newDicOrgAttr:
                a.write('\n\t\t{}:\n'.format(str(i).replace('(', '').replace(',', '')))
                unique_t = set(newDicOrgAttr[i])
                for item in unique_t:
                    a.write(f"\t\tCount of {str(item).replace(')', '')}: {newDicOrgAttr[i].count(item)}\n")

        if numpResultRegions.size > 0:
            newDicRegAttr = Convert(numpResultRegions)
            a.write('\n\tRegions attributes:\n')
            for i in newDicRegAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicRegAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicRegAttr[i].count(item)}\n")

        if numpResultCategAttr.size > 0:
            newDicCatAttr = Convert(numpResultCategAttr)
            a.write('\n\tCategory attributes:\n')
            for i in newDicCatAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicCatAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of \'{item}\' : {newDicCatAttr[i].count(item)}\n")

        if numpResultProgAttr.size > 0:
            newDicProgAttr = Convert(numpResultProgAttr)
            a.write('\n\tProgramme attributes:\n')
            for i in newDicProgAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicProgAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicProgAttr[i].count(item)}\n")

        if elementFrameWProgramme:
            countlstFrameWProgramme = dict(Counter(elementFrameWProgramme))
            orderFrameworkProgramDict = collections.OrderedDict(sorted(countlstFrameWProgramme.items()))
            a.write('\n\t\tFramework Programme list:\n')
            for y in orderFrameworkProgramDict:
                a.write("\t\t\t{}.......... {} \n".format(y, orderFrameworkProgramDict[y]))

        if numpResultProjectAttr.size > 0:
            newDicProjectAttr = Convert(numpResultProjectAttr)
            a.write('\n\tProject attributes:\n')
            for i in newDicProjectAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicProjectAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicProjectAttr[i].count(item)}\n")

        if numpResultCallAttr.size > 0:
            newDicCallAttr = Convert(numpResultCallAttr)
            a.write('\n\tCall attributes:\n')
            for i in newDicCallAttr:
                a.write('\n\t\t{}:\n'.format(i))
                unique_t = set(newDicCallAttr[i])
                # count of each element in tuple
                for item in unique_t:
                    a.write(f"\t\t\tCount of {item}: {newDicCallAttr[i].count(item)}\n")

        a.write('\n\tNumber of programme in CORDIS: {} \n'.format(countProgramme))

        if countPublicUrl:
            percentageProgrammewithURL = countPublicUrl / countProgramme
            a.write('\n\tNumber of programme with an assigned URL: {} \n'.format(countPublicUrl))
            a.write(
                '\n\tPercentage of programme with URL assigned from all articles in CORDIS: {:.3%} \n'.format(
                    percentageProgrammewithURL))

        percentageProgramme = countProgramme / totalFiles
        if percentageProgramme:
            a.write('\n\tTotal number of items in CORDIS: {} \n'.format(totalFiles))
            a.write('\n\tPercentage of programme in CORDIS: {:.3%} \n\n\n'.format(percentageProgramme))

    a.close()


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

# the following function convert a given list to a dictionary
def Convert(lst):
    lista = []
    for j in lst:
        if len(j) == 1:
            j = str(j).replace('[', '').replace(']', '').replace('\'', '').strip()
            my_tuple = tuple(str(j).split(' '))
            lista.append(my_tuple)

        else:
            if "\n" in str(j):
                j1 = str(j).split("\n")
                j1[0] = j1[0].replace('[', '')
                j1[0] = j1[0].replace(']', '')
                j1[0] = j1[0].replace('\'', '')
                j1[0] = j1[0].strip()
                j1[1] = j1[1].replace('[', '')
                j1[1] = j1[1].replace(']', '')
                j1[1] = j1[1].replace('\'', '')
                j1[1] = j1[1].strip()
                my_tuple = tuple(j1[0].split(' '))
                lista.append(my_tuple)
                my_tuple = tuple(j1[1].split(' '))
                lista.append(my_tuple)
            else:
                for index in j:
                    my_tuple = tuple(str(index).replace('\'', '').split(' '))
                    lista.append(my_tuple)

    groups = {}
    # logger.info('lista as it is {}'.format(lista))
    for group, value in lista:
        # logger.info(' group {} value {}'.format(group, value))
        if group not in groups:
            groups.update({group: [value]})
        else:
            groups[group].append(value)

    # logger.info('converted list into dict {}'.format(groups))
    return groups


# launch of the script
def main():
    # Here below the execution of the different functions to create the Statistics file
    statisticsEvent()
    statisticsProgramme()
    statisticsPublication()
    statisticsArticle()
    statisticsProject()
    statisticsResult()
    countingFilesTypes()


if __name__ != '__main__':
    pass
else:
    main()
