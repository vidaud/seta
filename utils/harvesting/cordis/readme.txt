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
*      py 'C:/<working directory>/cordisDLSearchRSLTFromUrl.py'
*
* 3) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do:
*			update existing data (U)
*			add new data (A)
*			download all data (D):
*
*			If is going to be a download of just recently added files, choose letter A:
*			
*			a) After given :
*			     A log file will be generated under C:\<working directory>\CORDIS\logs\logNewPages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			    new data filtered by contentCreationDate is on folder  C:\<working directory>\CORDIS\new_pagesAc\cordis_all_eng and under 
*			    new data filtered by startDate is on folder C:\<working directory>\CORDIS\new_pagesAs\cordis_all_eng
*			
*			
*			If is going to be a first download choose letter D:
*			
*			
*			a) After given :
*			     A log file will be generated under C:\<working directory>\CORDIS\logs\logDownloadPages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			     C:\<working directory>\CORDIS\download_pages\cordis_all_eng
*			   
*			
*			If is going to be a download of just updated files, choose letter U:
*			
*			a) After given :
*			     A log file will be generated under C:\<working directory>\CORDIS\logs\logUpdatePages and from there it can be possible to follow the progress of the execution
*			
*			b) Once the script is finished, it is possible to find the download pages(JSON files) under 
*			    C:\<working directory>\CORDIS\update_pages\cordis_all_eng
*			
*			
* 4) To download the single files described inside the downloaded pages, from a windows power shell or a command line launch the script cordisReadJsonResultPages.py with the following command:
*      py 'C:/<working directory>/cordisReadJsonResultPages.py'
*
*
* 5)  A list of inputs will appear:
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
*		 			A log file will be generated under C:\<working directory>\CORDIS\logs\logDownloadFiles and from there it can be possible to follow the progress of the execution
*			
*			
*		 	b) Once the script is finished, it is possible to find the download files(XML files) under C:\<working directory>\CORDIS\downloadFiles\xmlFiles
*			
*			
* 6) To download the pdf files related to the results files from a windows power shell or a command line launch the script cordisDownloadPDF.py with the following command:
*		py 'C:/<working directory>/cordisDownloadPDF.py'
*
*
* 7) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*
*
* 8) After given :
* 		A log file will be generated under C:\<working directory>\CORDIS\logs\logDownloadPdf and from there it can be possible to follow the progress of the execution
*
*
*
* 9) Once the script is finished, it is possible to find the download files(PDF files) under C:\<working directory>\CORDIS\downloadPdfFiles
*
*
* 10) To have some statistics regarding the different regions, organizations or related framework programms involved in the different types of items, from a windows power shell or a 
*	  command line launch the script cordisStats.py with the following command:
*		py 'C:/<working directory>/cordisStats.py'
*
*
* 11) After given :
* 		A log file will be generated under C:\<working directory>\CORDIS\logs\logStats and from there it can be possible to follow the progress of the execution
*
* 12) Once the script is finished, it is possible to find the download files(TXT files) under C:\<working directory>\CORDIS and starting with name statistics
*
* 13) The file testProxy.py helps to test the proxy credentials given in some of the scripts used. It is not necessary to launch it alone, is already called from the scripts.
*
* 14) To download the DOI reference from the XML files, from a windows power shell or a command line launch the script cordisDlDOI.py with the following command:
*		py 'C:/<working directory>/cordisDlDOI.py'
*
*
* 15) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*
*
* 16) After given :
* 		A log file will be generated under C:\<working directory>\CORDIS\DOI\logs\logDlDOI and from there it can be possible to follow the progress of the execution
*
*
* 17) Once the script is finished, it is possible to find a txt file that contains the list of the CORDIS items and their related DOI number under C:\<working directory>\CORDIS\DOI\urlsDOI.txt
*
*
*
* 18) To download the DOI URL of the DOI numbers related to the CORDIS files, from a windows power shell or a command line launch the script cordisRdrDOIURL.py with the following command:
*		py 'C:/<working directory>/cordisRdrDOIURL.py'
*
*
* 19) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:*
*
*
* 20) After given :
* 		A log file will be generated under C:\<working directory>\CORDIS\DOI\logs\logRdrDOI and from there it can be possible to follow the progress of the execution
*
*
*
* 21) Once the script is finished, it is possible to find a txt file that contains the list of the CORDIS items and their related DOI number under C:\<working directory>\CORDIS\DOI\redirect_urls_DOI.txt