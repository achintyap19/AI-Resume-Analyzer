import { createContext, useState } from "react";

export const reportContext = createContext()

export const ReportProvider = ({ children }) => {

    const[loading, setLoading] = useState(false)
    const[report, setReport] = useState(null)
    const[reports, setReports] = useState([])


    return(
        <reportContext.Provider value={{loading, setLoading, report, setReport, reports, setReports}}>
            {children}
        </reportContext.Provider>
    )

}