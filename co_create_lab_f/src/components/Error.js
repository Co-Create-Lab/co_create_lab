import { Helmet } from "react-helmet"

export default function Error () {
    return(
        <>
        <div className="error d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-center">404 ... Ooopssssi <br></br>
                Something went wrong </h1>
            <iframe src="https://giphy.com/embed/gB5o7HVgpkCYM" className="errorgif"></iframe>


        </div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Error|CoCreateLab</title>
            <link rel="canonical" href="/404" />
        </Helmet>
        </>
    )
}