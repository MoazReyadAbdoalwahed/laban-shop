import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom"
function Error() {

    const error = useRouteError()

    let ErrorStutes: number
    let ErrorStuatesText: string

    if (isRouteErrorResponse(error)) {

        ErrorStutes = error.status
        ErrorStuatesText = error.statusText
    } else {
        ErrorStutes = 400
        ErrorStuatesText = "page not found"
    }
    return (
        <div className="relative top-[300px] text-center">
            <h1 className="text-8xl ">{ErrorStutes}</h1>
            <p>{ErrorStuatesText}</p>
            <Link to="/" replace={true}>
                go to the home page
            </Link>
        </div>
    )
}

export default Error