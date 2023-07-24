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
* 1) Copy the files from <JRC box>\SeTA\harvesting\EURPARL\EUROPARL harvesting code\* to a working
*    directory and ensure that directory has write permission.
*   
* 2) From a windows power shell or a command line launch the script eurparlDlLstDocs.py with the following command:
*      py 'C:/<working directory>/eurparlDlLstDocs.py'
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
*
* 4) After given :
*      A log file will be generated under:
*           (adopted-texts list) C:\<working directory>\EURPARL\logs\logAdopTxtLst
*           (plenary-documents list) C:\<working directory>\EURPARL\logs\logDocsLst
*           (meetings list) C:\<working directory>\EURPARL\logs\logMeetLst
*           (parliamentary-questions list) C:\<working directory>\EURPARL\logs\logQuestionsLst
*           (plenary-session list) C:\<working directory>\EURPARL\logs\logSessionsLst
*
*  and from there it can be possible to follow the progress of the execution
*
* 5) Once the script is finished, it is possible to find the download pages(JSON files) under:
*
*     (adopted-texts list) C:\<working directory>\EURPARL\download_pages\parlAdopTxtLst
*     (plenary-documents list) C:\<working directory>\EURPARL\download_pages\parl_docsLst
*     (meetings list) C:\<working directory>\EURPARL\download_pages\parlMeetLst
*     (parliamentary-questions list) C:\<working directory>\EURPARL\download_pages\parl_questionsLst
*     (plenary-session list) C:\<working directory>\EURPARL\download_pages\parlSessionsLst
*
*
* 6) From a windows power shell or a command line launch the script eurparlReadJsonResultPages.py with the following command:
*      py 'C:/<working directory>/eurparlReadJsonResultPages.py'
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
*
* 8)  After given :
* 		A log file will be generated under:
*           (adopted-texts) C:\<working directory>\EURPARL\logs\logparlAdopTxtFiles
*           (plenary-documents) C:\<working directory>\EURPARL\logs\logDocsFiles
*           (meetings) C:\<working directory>\EURPARL\logs\logMeetFiles
*           (parliamentary-questions) C:\<working directory>\EURPARL\logs\logQuestionsFiles
*           (plenary-sessions) C:\<working directory>\EURPARL\logs\logSessionsFiles
*
*and from there it can be possible to follow the progress of the execution
*
*
* 9) Once the script is finished, it is possible to find the download files(rdf/xml files) under:
*
*           (adopted-texts)  C:\<working directory>\EURPARL\downloadFiles\parlAdopTxtFiles
*           (plenary-documents) C:\<working directory>\EURPARL\downloadFiles\parl_docsFiles
*           (meetings) C:\<working directory>\EURPARL\downloadFiles\parlMeetFiles
*           (parliamentary-questions) C:\<working directory>\EURPARL\downloadFiles\parl_questionsFiles
*           (plenary-sessions) C:\<working directory>\EURPARL\downloadFiles\parlSessionsFiles
*
*
* 10) To download the pdf files related to the results files from a windows power shell or a command line launch the script eurParlDownloadPDFile.py with the following command:
*		py 'C:/Users/delvala/Documents/SETA/seta_project/eurParlDownloadPDFile.py'
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
*           (adopted-texts PDF files) C:\<working directory>\EURPARL\logs\logparlAdopTxtPDFFiles
*           (plenary-documents PDF files) C:\<working directory>\EURPARL\logs\logDocsPDFFiles
*           (parliamentary-questions PDF files) C:\<working directory>\EURPARL\logs\logQuestionsPDFFiles
*           (plenary-session PDF files) C:\<working directory>\EURPARL\logs\logSessionsPDFFiles
*
* and from there it can be possible to follow the progress of the execution
*
*
*
* 13) Once the script is finished, it is possible to find the download files(PDF files) under:
*       (adopted-texts PDF files) C:\<working directory>\EURPARL\downloadPdfFiles\parlAdopTxtPDF
*       (plenary-documents PDF files) C:\<working directory>\EURPARL\downloadPdfFiles\parlDocsPdf
*       (parliamentary-questions PDF files) C:\<working directory>\EURPARL\downloadPdfFiles\parlQuestionsPdf
*       (plenary-session PDF files) C:\<working directory>\EURPARL\downloadPdfFiles\parlSessionsPdf
*
*
* 14) To have some statistics regarding the different regions, organizations or related framework programms involved in the different types of items, from a windows power shell or a 
*	  command line launch the script eurParlStats.py with the following command:
*		py 'C:/Users/delvala/Documents/SETA/seta_project/eurParlStats.py'

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
*		A log file will be generated under C:\<working directory>\EURPARL\logs\logStats and from there it can be possible to follow the progress of the execution
*
* 17) Once the script is finished, it is possible to find the download files(TXT files) under C:\<working directory>\EURPARL and starting with name statistics
*
* 18) The file testProxy.py helps to test the proxy credentials given in some scripts used. It is not necessary to launch it alone, is already used inside the scripts.
*