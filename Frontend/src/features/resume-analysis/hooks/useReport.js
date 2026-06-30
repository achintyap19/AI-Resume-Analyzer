import { useContext } from "react";
import { reportContext } from "../report.context";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/report.api";


export const useReport = () => {

    const context = useContext(reportContext)

    if(!context){
        throw new Error('useReport must be used within an ReportProvider')
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context

    const generateReport = async({resumeFile, jobDescription, selfDescription}) =>{
        setLoading(true)
        try{
            const response = await generateInterviewReport({resumeFile, jobDescription, selfDescription})
            setReport(response.interviewReport)
            return response.interviewReport;

        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const getReportById = async(reportId) =>{
        setLoading(true)
        try{
            const response = await getInterviewReportById(reportId)
            setReport(response.interviewReport)
            return response.interviewReport;
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const getAllReports = async()=>{
        setLoading(true)
        try{
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)

        }catch(error){
            console.log(error)

        }finally{
            setLoading(false)
        }

    }

    return { loading,report,reports,generateReport,getReportById,getAllReports }
    
}