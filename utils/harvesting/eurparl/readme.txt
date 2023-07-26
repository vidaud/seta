******************************************************************************
*
* README for download of data files from EUROPARL https://data.europarl.europa.eu/sitefront/odp/en/developer-corner/opendata-api
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
* 1) Copy the files from <project directory>\src\utils\harvesting\eurparl\* to a working
*    directory and ensure that directory has write permission.
*
*
* 2) From a windows power shell or a command line launch the script eurparlDlLstDocs.py with the following command:
*       Before launching the script verify that on rows:
*
*       startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
*
*       The drive is set to where the documents will be save.
*
*
*       Then it is possible to launch the script
*
*       py '<working directory>/eurparlDlLstDocs.py'
*
* 3) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do: 
*			download adopted-texts list (A)
*			download plenary-documents list (D)
*			download meetings list (M)
*			download parliamentary-questions list (Q)
*			download plenary-session list (S)
*
*       from which year to start downloading:
*
* 4) After given :
*      A log file will be generated under:
*           (adopted-texts list) UNIT DRIVE:\<working directory>\EURPARL\logs\logAdopTxtLst
*           (plenary-documents list) UNIT DRIVE:\<working directory>\EURPARL\logs\logDocsLst
*           (meetings list) UNIT DRIVE:\<working directory>\EURPARL\logs\logMeetLst
*           (parliamentary-questions list) UNIT DRIVE:\<working directory>\EURPARL\logs\logQuestionsLst
*           (plenary-session list) UNIT DRIVE:\<working directory>\EURPARL\logs\logSessionsLst
*
*  and from there it can be possible to follow the progress of the execution
*
* 5) Once the script is finished, it is possible to find the download pages(JSON files) under:
*
*     (adopted-texts list) UNIT DRIVE:\<working directory>\EURPARL\download_pages\parlAdopTxtLst\*every year since the years to start downloading
*     (plenary-documents list) UNIT DRIVE:\<working directory>\EURPARL\download_pages\parl_docsLst\*every year since the years to start downloading
*     (meetings list) UNIT DRIVE:\<working directory>\EURPARL\download_pages\parlMeetLst\*every year since the years to start downloading
*     (parliamentary-questions list) UNIT DRIVE:\<working directory>\EURPARL\download_pages\parl_questionsLst\*every year since the years to start downloading
*     (plenary-session list) UNIT DRIVE:\<working directory>\EURPARL\download_pages\parlSessionsLst\*every year since the years to start downloading
*
*
* 6) From a windows power shell or a command line launch the script eurparlReadJsonResultPages.py with the following command:
*       Before launching the script verify that on rows:
*
*       startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
*
*       The drive is set to where the documents will be save.
*
*       Then it is possible to launch the script
*
*      py 'UNIT DRIVE:/<working directory>/eurparlReadJsonResultPages.py'
*
*
* 7)  A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do:
*			download adopted-texts (A)
*			download plenary-documents (D)
*			download meetings (M)
*			download parliamentary-questions (Q)
*			download plenary-sessions (S)
*
* 8)  After given :
* 		A log file will be generated under:
*           (adopted-texts) UNIT DRIVE:\<working directory>\EURPARL\logs\logparlAdopTxtFiles
*           (plenary-documents) UNIT DRIVE:\<working directory>\EURPARL\logs\logDocsFiles
*           (meetings) UNIT DRIVE:\<working directory>\EURPARL\logs\logMeetFiles
*           (parliamentary-questions) UNIT DRIVE:\<working directory>\EURPARL\logs\logQuestionsFiles
*           (plenary-sessions) UNIT DRIVE:\<working directory>\EURPARL\logs\logSessionsFiles
*
*       and from there it can be possible to follow the progress of the execution
*
*
* 9) Once the script is finished, it is possible to find the download files(rdf/xml files) under:
*
*           (adopted-texts)  UNIT DRIVE:\<working directory>\EURPARL\downloadFiles\parlAdopTxtFiles\*every year since the years to start downloading
*           (plenary-documents) UNIT DRIVE:\<working directory>\EURPARL\downloadFiles\parl_docsFiles\*every year since the years to start downloading
*           (meetings) UNIT DRIVE:\<working directory>\EURPARL\downloadFiles\parlMeetFiles\*every year since the years to start downloading
*           (parliamentary-questions) UNIT DRIVE:\<working directory>\EURPARL\downloadFiles\parl_questionsFiles\*every year since the years to start downloading
*           (plenary-sessions) UNIT DRIVE:\<working directory>\EURPARL\downloadFiles\parlSessionsFiles\*every year since the years to start downloading
*
*
* 10) To download the pdf files related to the results files from a windows power shell or a command line launch the script eurParlDownloadPDFile.py with the following command:
*
*       Before launching the script verify that on rows:
*
*       startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
*
*       The drive is set to where the documents will be save.
*
*       Then it is possible to launch the script
*
*       py 'UNIT DRIVE:<working directory>/eurParlDownloadPDFile.py'
*
*
* 11) A list of inputs will appear:
*		insert your internet proxy username: 
*		insert your internet proxy password:
*		choose what you want to do:
*			download adopted-texts PDF files (A)
*			download plenary-documents PDF files (D)
*			download parliamentary-questions PDF files (Q)
*			download plenary-session PDF files (S):
*
*
* 12) After given :
* 		A log file will be generated under:
*           (adopted-texts PDF files) UNIT DRIVE:\<working directory>\EURPARL\logs\logparlAdopTxtPDFFiles
*           (plenary-documents PDF files) UNIT DRIVE:\<working directory>\EURPARL\logs\logDocsPDFFiles
*           (parliamentary-questions PDF files) UNIT DRIVE:\<working directory>\EURPARL\logs\logQuestionsPDFFiles
*           (plenary-session PDF files) UNIT DRIVE:\<working directory>\EURPARL\logs\logSessionsPDFFiles
*
*       and from there it can be possible to follow the progress of the execution
*
*
*
* 13) Once the script is finished, it is possible to find the download files(PDF files) under:
*       (adopted-texts PDF files) UNIT DRIVE:\<working directory>\EURPARL\downloadPdfFiles\parlAdopTxtPDF
*       (plenary-documents PDF files) UNIT DRIVE:\<working directory>\EURPARL\downloadPdfFiles\parlDocsPdf
*       (parliamentary-questions PDF files) UNIT DRIVE:\<working directory>\EURPARL\downloadPdfFiles\parlQuestionsPdf
*       (plenary-session PDF files) UNIT DRIVE:\<working directory>\EURPARL\downloadPdfFiles\parlSessionsPdf
*
*
* 14) To have some statistics regarding the different regions, organizations or related framework programms involved in the different types of items, from a windows power shell or a
*	  command line launch the script eurParlStats.py with the following command:
*
*       Before launching the script verify that on rows:
*
*       startDir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
*
*       The drive is set to where the documents will be save.
*
*       Then it is possible to launch the script
*
*
*		py 'UNIT DRIVE:\<working directory>\eurParlStats.py'
*
* 15) A list of inputs will appear:
*		choose what you want to do:
*			statistics of adopted-texts PDF files (A)
*			statistics of plenary-documents PDF files (D)
*			statistics of parliamentary-questions PDF files (Q)
*			statistics of plenary-session PDF files (S):
*
*
* 16) After given :
* 		A text file will be generated with the information regarding the number of PDF documents downloaded and the different types of documents and the different language versions.
*		A log file will be generated under UNIT DRIVE:\<working directory>\logs\logStats and from there it can be possible to follow the progress of the execution
*
* 17) Once the script is finished, it is possible to find the download files(TXT files) under UNIT DRIVE:\<working directory>\EURPARL and starting with name statistics
*
* 18) The file testProxy.py helps to test the proxy credentials given in some scripts used. It is not necessary to launch it alone, is already used inside the scripts.
*