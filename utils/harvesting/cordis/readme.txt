******************************************************************************
*
* README for download of data files from CORDIS https://cordis.europa.eu/search/en
*
*
******************************************************************************
*
*               REQUIREMENTS
*
* 1. Python 3.9.13:
*	https://www.python.org/downloads/
*
******************************************************************************
*
*               Launch of the scripts to download data
*
* 1) Copy the files from <JRC box>\SeTA\harvesting\CORDIS\CORDIS harvesting code\* to a working
*    directory and ensure that directory has write permission.
*   
* 2) From a windows power shell or a command line launch the script cordisDLSearchRSLTFromUrl.py with the following command:
*
*      py 'UNIT DRIVE:/<working directory>/cordisDLSearchRSLTFromUrl.py'
*
* 3) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do:
*			update existing data (U)
*			add new data (A)
*			download all data (D):
*
*
* 4) If is going to be a download of just recently added files, choose letter A:
*			
*			a) After given :
*			     A log file will be generated under UNIT DRIVE:\<working directory>\CORDIS\logs\logNewPages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			    new data filtered by contentCreationDate is on folder  UNIT DRIVE:\<working directory>\CORDIS\new_pagesAc\cordis_all_eng and under
*			    new data filtered by startDate is on folder UNIT DRIVE:\<working directory>\CORDIS\new_pagesAs\cordis_all_eng
*			
*			
* 5) If is going to be a first download choose letter D:
*
*			a) After given :
*			     A log file will be generated under UNIT DRIVE:\<working directory>\CORDIS\logs\logDownloadPages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			     UNIT DRIVE:\<working directory>\CORDIS\download_pages\cordis_all_eng
*			   
*			
* 6) If is going to be a download of just updated files, choose letter U:
*			
*			a) After given :
*			     A log file will be generated under UNIT DRIVE:\<working directory>\CORDIS\logs\logUpdatePages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			    UNIT DRIVE:\<working directory>\CORDIS\update_pages\cordis_all_eng
*			
*			
* 7) To download the single files described inside the downloaded pages, from a windows power shell or a command line launch the script cordisReadJsonResultPages.py with the following command:
*      py 'UNIT DRIVE:/<working directory>/cordisReadJsonResultPages.py'
*
*
* 8)  A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do:
*			download update existing files (U)
*			download new files (A)
*			download all files (D):
*
*		 	For all the options:
*			
*		 	a) After given :
*		 			A log file will be generated under UNIT DRIVE:\<working directory>\CORDIS\logs\logDownloadFiles and from there it can be possible to follow the progress of the execution
*			
*			
*		 	b) Once the script is finished, it is possible to find the download files(XML files) under UNIT DRIVE:\<working directory>\CORDIS\downloadFiles\xmlFiles
*			
*			
*  9) To download the pdf files related to the results files from a windows power shell or a command line launch the script cordisDownloadPDF.py with the following command:
*
*   		py 'UNIT DRIVE:/<working directory>/cordisDownloadPDF.py'
*
*
*  10) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*
*
*  11) After given :
* 		A log file will be generated under UNIT DRIVE:\<working directory>\CORDIS\logs\logDownloadPdf and from there it can be possible to follow the progress of the execution
*
*
*  12) Once the script is finished, it is possible to find the download files(PDF files) under UNIT DRIVE:\SeTA\CORDIS\pdfFilesRelated
*
*
*  13) To have some statistics regarding the different regions, organizations or related framework programms involved in the different types of items, from a windows power shell or a
*	  command line launch the script cordisStats.py with the following command:
*		py 'UNIT DRIVE:/<working directory>/cordisStats.py'
*
*  14) After given :
*       Regarding the different types, from the imported files, a function is called to generate the statistics.
*           File statsArticle that calls function statisticsArticle
*           File statsEvent that calls function statisticsEvent
*           File statsProgramme that calls function statisticsProgramme
*           File statsProject that calls function statisticsProject
*           File statsPublication that calls function statisticsPublication
*           File statsResults that calls function statisticsResults
*
*       There is also a file statsFunctions.py that contains support functions to these files:
*           Convert --  convert a given list to a dictionary
*           countingFilesTypes -- counts all the different downloaded items (e.g. article, event, programme, project,
*                                 publication, result), gives some percentage and write it to txt file under folder
*                                 UNIT DRIVE:\<working directory>\CORDIS\stats\output_lst_cordis_xml_file.txt
*
*  16) A log file will be generated under:
*           UNIT DRIVE:\<working directory>\CORDIS\logs\logStats and from there it can be possible to follow the progress of the execution
*
*  15) Once the script is finished, it is possible to find the download files(TXT files) under:
*           UNIT DRIVE:\<working directory>\CORDIS and starting with name statistics:
*
*
*  16) The file testProxy.py helps to test the proxy credentials given in some of the scripts used. It is not necessary to launch it alone, is already called from the scripts.
*
*  17) To download the DOI reference from the XML files, from a windows power shell or a command line launch the script cordisDlDOI.py with the following command:
*		py 'UNIT DRIVE:/<working directory>/cordisDlDOI.py'
*
*
*  18) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*
*
*  19) After given :
* 		A log file will be generated under
*           UNIT DRIVE:\<working directory>\CORDIS\DOI\logs\logDlDOI and from there it can be possible to follow the progress of the execution
*
*
*  20) Once the script is finished, it is possible to find a txt file that contains the list of the CORDIS items and their related DOI number under
*           UNIT DRIVE:\<working directory>\CORDIS\DOI\urlsDOI.txt
*
*
*
*  21) To download the DOI URL of the DOI numbers related to the CORDIS files, from a windows power shell or a command line launch the script cordisRdrDOIURL.py with the following command:
*		py 'UNIT DRIVE:/<working directory>/cordisRdrDOIURL.py'
*
*
*  22) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*
*
*  23) After given :
* 		A log file will be generated under
*           UNIT DRIVE:\<working directory>\CORDIS\DOI\logs\logRdrDOI
*
*       and from there it can be possible to follow the progress of the execution
*
*
*  24) Once the script is finished, it is possible to find a txt file that contains the list of the CORDIS items and their related DOI number under
*       UNIT DRIVE:\<working directory>\CORDIS\DOI\redirect_urls_DOI.txt