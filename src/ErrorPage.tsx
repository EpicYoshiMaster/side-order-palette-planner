import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export default function ErrorPage() {
	const error = useRouteError();
	
	return (
		<div>
			An error has occurred:
			<p>
				{isRouteErrorResponse(error) ? `${error.status} ${error.data}` : `${console.log(error)}`}
			</p>
		</div>
	)
}