export enum FrontendToBackendEvent {
	GetDirectoryContents = "get-directory-contents",
	GetDirectoryContentsRecursive = "get-directory-contents-recursive",
	DoesPathExist = "does-path-exist",
	CheckLatency = "check-latency",
}

export enum BackendToFrontendEvent {
	ConnectedToServer = "connected-to-server",
}
