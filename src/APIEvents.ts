export enum FrontendToBackendEvent {
	ValidatePath = "validate-path",
	GetDirectoryContents = "get-directory-contents",
}

export enum BackendToFrontendEvent {
	ConnectedToServer = "connected-to-server",
	ReceivedDirectoryContents = "received-directory-contents",
}
