/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as TracksImport } from './routes/tracks';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const TracksRoute = TracksImport.update({
  id: '/tracks',
  path: '/tracks',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/tracks': {
      id: '/tracks';
      path: '/tracks';
      fullPath: '/tracks';
      preLoaderRoute: typeof TracksImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/tracks': typeof TracksRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/tracks': typeof TracksRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/tracks': typeof TracksRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/tracks';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/tracks';
  id: '__root__' | '/' | '/tracks';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  TracksRoute: typeof TracksRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  TracksRoute: TracksRoute,
};

export const routeTree = rootRoute._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/tracks"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/tracks": {
      "filePath": "tracks.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
