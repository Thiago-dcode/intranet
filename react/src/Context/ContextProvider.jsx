import { createContext, useContext, useState } from 'react';
const CompanyContext = createContext()
const UpdateCompany = createContext()
export function useCompany() {
    return useContext(CompanyContext)

}
export function useUpdateCompany() {
    return useContext(UpdateCompany)

}
export function CompanyProvider({ children }) {

    const [company, _setCompany] = useState('')


    function setCompany(companyName) {

        _setCompany(companyName);
    }
    return (
        <CompanyContext.Provider value={company}>
            <UpdateCompany.Provider value={setCompany}>{children}</UpdateCompany.Provider>

        </CompanyContext.Provider>
    )
}