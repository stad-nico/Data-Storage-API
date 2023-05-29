import { FrontendToBackendEvent } from "src/APIEvents";
import { Response } from "src/Response";

export type ServerError = {
	message: string;
	status: Response;
	event: FrontendToBackendEvent;
};
