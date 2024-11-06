/// <reference types="@fastly/js-compute" />

import { app } from "./app";

/**
    Attach a FetchEventListener, this is the entry point to all Fastly JavaScript Compute@Edge applications
 */
addEventListener("fetch", (event) => {
    event.respondWith(
        Promise.resolve(event)
            .then(app)
            .catch(error => {
                console.error(error.message);
                console.error(error.stack);
                return new Response(error.message, { status: 500 });
            })
    )
})