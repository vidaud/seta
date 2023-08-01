import collections
import fnmatch
import glob
import logging
import os
import os.path
from datetime import datetime

# the following script gives some statistics regarding the different types of items

# setting the source and destination folders
startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))

# assignment of folder where to read the files
pathFolder = startDir + '/CORDIS/downloadFiles/xmlFiles'

# the following script gives some statistics regarding the different types of items

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
