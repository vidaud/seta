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

# the following script read all the xml file of items of type "programme" and gives some statistics like the different
# type of regions, Organizations, Associations, Framework programme and also the related items like articles, call
# and writes to statisticsProgramme.txt file

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
    numpResultCategAttr = numpy.array(lstResultCategAttr)

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
