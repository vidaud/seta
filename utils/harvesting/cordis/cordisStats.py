import fnmatch
import logging
import os.path
from datetime import datetime
from statsArticle import statisticsArticle
from statsEvent import statisticsEvent
from statsProject import statisticsProject
from statsPublication import statisticsPublication
from statsResult import statisticsResult
from statsProgramme import statisticsProgramme
from statsFunctions import countingFilesTypes

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


# launch of the script
def main():
    # Here below the execution of the different functions to create the Statistics file
    statisticsArticle()
    statisticsEvent()
    statisticsProgramme()
    statisticsProject()
    statisticsPublication()
    statisticsResult()
    countingFilesTypes()


if __name__ != '__main__':
    pass
else:
    main()
