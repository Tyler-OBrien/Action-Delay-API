var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e4) {
    throw err = [e4], e4;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/errors_D7mtj974.mjs
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) return "";
  const lines = normalizeLF(src).split("\n").map((ln2) => ln2.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n3 = -2; n3 <= 2; n3++) if (lines[loc.line + n3]) visibleLines.push(loc.line + n3);
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w4 = `> ${lineNo}`;
    if (w4.length > gutterWidth) gutterWidth = w4.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine) output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({ length: loc.column }).join(" ")}^
`;
  }
  return output;
}
function isAstroError(e4) {
  return e4 != null && (e4 instanceof AstroError || AstroError.is(e4));
}
var ClientAddressNotAvailable, PrerenderClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, ImageMissingAlt, InvalidImageService, MissingImageDimension, FailedToFetchRemoteImageDimensions, RemoteImageNotAllowed, UnsupportedImageFormat, UnsupportedImageConversion, PrerenderDynamicEndpointPathCollide, ExpectedImage, ExpectedImageOptions, ExpectedNotESMImage, IncompatibleDescriptorOptions, NoImageMetadata, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, LocalsReassigned, AstroResponseHeadersReassigned, LocalImageUsedWrongly, i18nNoLocaleFoundInPath, RewriteWithBodyUsed, ForbiddenRewrite, FontFamilyNotFound, MissingGetFontFileRequestUrl, UnavailableAstroGlobal, NoManifestAvailable, ActionsReturnedInvalidDataError, ActionNotFoundError, CacheNotEnabled, AstroError;
var init_errors_D7mtj974 = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/errors_D7mtj974.mjs"() {
    "use strict";
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
    };
    PrerenderClientAddressNotAvailable = {
      name: "PrerenderClientAddressNotAvailable",
      title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
      message: (name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}.`
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in prerendered pages.",
      message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
      hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided.'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
      hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
      hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on \`client:only\`.`
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside `getStaticPaths()`'s return value.",
      message: (entryType) => `Invalid entry returned by \`getStaticPaths()\`. Expected an object, got \`${entryType}\`.`,
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by `getStaticPaths()`.",
      message: (returnType) => `Invalid type returned by \`getStaticPaths()\`. Expected an \`array\`, got \`${returnType}\`.`,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths()` route.",
      message: "Missing or empty required `params` property on `getStaticPaths()` route.",
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid route parameter returned by `getStaticPaths()`.",
      message: (key, value, valueType) => `Invalid \`getStaticPaths()\` route parameter for \`${key}\`. Expected a string or undefined, received \`${valueType}\` (\`${value}\`).`,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths()` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: (slotName2) => `Unable to create a slot named \`${slotName2}\`. \`${slotName2}\` is a reserved slot name. Please update the name of this slot.`
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    ImageMissingAlt = {
      name: "ImageMissingAlt",
      title: 'Image missing required "alt" property.',
      message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
      hint: 'Use an empty string ("") for decorative images.'
    };
    InvalidImageService = {
      name: "InvalidImageService",
      title: "Error while loading image service.",
      message: "There was an error loading the configured image service. Please see the stack trace for more information."
    };
    MissingImageDimension = {
      name: "MissingImageDimension",
      title: "Missing image dimensions.",
      message: (missingDimension, imageURL) => `Missing ${missingDimension === "both" ? "width and height attributes" : `${missingDimension} attribute`} for ${imageURL}. When using remote images, both dimensions are required in order to avoid CLS.`,
      hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets). You can also use `inferSize={true}` for remote images to get the original dimensions."
    };
    FailedToFetchRemoteImageDimensions = {
      name: "FailedToFetchRemoteImageDimensions",
      title: "Failed to retrieve remote image dimensions.",
      message: (imageURL) => `Failed to get the dimensions for ${imageURL}.`,
      hint: "Verify your remote image URL is accurate, and that you are not using `inferSize` with a file located in your `public/` folder."
    };
    RemoteImageNotAllowed = {
      name: "RemoteImageNotAllowed",
      title: "Remote image is not allowed.",
      message: (imageURL) => `Remote image ${imageURL} is not allowed by your image configuration.`,
      hint: "Update `image.domains` or `image.remotePatterns`, or remove `inferSize` for this image."
    };
    UnsupportedImageFormat = {
      name: "UnsupportedImageFormat",
      title: "Unsupported image format.",
      message: (format, imagePath, supportedFormats) => `Received unsupported format \`${format}\` from \`${imagePath}\`. Currently only ${supportedFormats.join(", ")} are supported by our image services.`,
      hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for."
    };
    UnsupportedImageConversion = {
      name: "UnsupportedImageConversion",
      title: "Unsupported image conversion.",
      message: "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
      hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m4) => `.json` + m4)}\``
    };
    ExpectedImage = {
      name: "ExpectedImage",
      title: "Expected src to be an image.",
      message: (src, typeofOptions, fullOptions) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${src}\` (type: \`${typeofOptions}\`).

Full serialized options received: \`${fullOptions}\`.`,
      hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it."
    };
    ExpectedImageOptions = {
      name: "ExpectedImageOptions",
      title: "Expected image options.",
      message: (options) => `Expected \`getImage()\` parameter to be an object. Received \`${options}\`.`
    };
    ExpectedNotESMImage = {
      name: "ExpectedNotESMImage",
      title: "Expected image options, not an ESM-imported image.",
      message: "An ESM-imported image cannot be passed directly to `getImage()`. Instead, pass an object with the image in the `src` property.",
      hint: "Try changing `getImage(myImage)` to `getImage({ src: myImage })`"
    };
    IncompatibleDescriptorOptions = {
      name: "IncompatibleDescriptorOptions",
      title: "Cannot set both `densities` and `widths`.",
      message: "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.",
      hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors."
    };
    NoImageMetadata = {
      name: "NoImageMetadata",
      title: "Could not process image metadata.",
      message: (imagePath) => `Could not process image metadata${imagePath ? ` for \`${imagePath}\`` : ""}.`,
      hint: "This is often caused by a corrupted or malformed image. Re-exporting the image from your image editor may fix this issue."
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    LocalsReassigned = {
      name: "LocalsReassigned",
      title: "`locals` must not be reassigned.",
      message: "`locals` cannot be assigned directly.",
      hint: "Set a `locals` property instead."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    LocalImageUsedWrongly = {
      name: "LocalImageUsedWrongly",
      title: "Local images must be imported.",
      message: (imageFilePath) => `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or a URL, it cannot be a string filepath. Received \`${imageFilePath}\`.`,
      hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections). See https://docs.astro.build/en/reference/modules/astro-assets/#src-required for more information on the `src` property."
    };
    i18nNoLocaleFoundInPath = {
      name: "i18nNoLocaleFoundInPath",
      title: "The path doesn't contain any locale.",
      message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
    };
    RewriteWithBodyUsed = {
      name: "RewriteWithBodyUsed",
      title: "Cannot use `Astro.rewrite()` after the request body has been read.",
      message: "`Astro.rewrite()` cannot be used if the request body has already been read. If you need to read the body, first clone the request.",
      hint: "Read the body from `Astro.request.clone()` instead of `Astro.request`, so the original request can still be rewritten."
    };
    ForbiddenRewrite = {
      name: "ForbiddenRewrite",
      title: "Forbidden rewrite to a static route.",
      message: (from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build, the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`,
      hint: (component) => `Add \`export const prerender = false\` to the component '${component}', or use \`Astro.redirect()\`.`
    };
    FontFamilyNotFound = {
      name: "FontFamilyNotFound",
      title: "Font family not found.",
      message: (family) => `No data was found for the \`"${family}"\` family passed to the \`<Font>\` component.`,
      hint: "This is often caused by a typo. Check that the `<Font />` component is using a `cssVariable` specified in your config."
    };
    MissingGetFontFileRequestUrl = {
      name: "MissingGetFontFileRequestUrl",
      title: "`experimental_getFontFileURL()` requires the request URL with on-demand rendering.",
      hint: "Pass the request URL as the 2nd argument, for example `Astro.url`."
    };
    UnavailableAstroGlobal = {
      name: "UnavailableAstroGlobal",
      title: "Unavailable Astro global in `getStaticPaths()`.",
      message: (name) => `The Astro global is not available in this scope. Please remove \`Astro.${name}\` from your \`getStaticPaths()\` function.`
    };
    NoManifestAvailable = {
      name: "NoManifestAvailable",
      title: "No manifest available.",
      message: "`new FetchState(request)` was called outside of an Astro server, so no manifest is available.",
      hint: "Make sure this code runs as part of your Astro app, such as its fetch entrypoint. If this error occurred inside an Astro-built server, please open an issue at https://github.com/withastro/astro/issues."
    };
    ActionsReturnedInvalidDataError = {
      name: "ActionsReturnedInvalidDataError",
      title: "Action handler returned invalid data.",
      message: (error3) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error3}`,
      hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
    };
    ActionNotFoundError = {
      name: "ActionNotFoundError",
      title: "Action not found.",
      message: (actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`,
      hint: "You can run `astro check` to detect type errors caused by mismatched action names."
    };
    CacheNotEnabled = {
      name: "CacheNotEnabled",
      title: "Cache is not enabled.",
      message: "`Astro.cache` is not available because the cache feature is not enabled. To use caching, configure a cache provider in your Astro config under `cache`.",
      hint: 'Use an adapter that provides a default cache provider, or set one explicitly: `cache: { provider: "..." }`. See https://docs.astro.build/en/guides/caching/.'
    };
    AstroError = class extends Error {
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message) this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err?.type === "AstroError";
      }
    };
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/server_CW5TLezH.mjs
function encodeHexUpperCase(data) {
  let result = "";
  for (let i5 = 0; i5 < data.length; i5++) {
    result += alphabetUpperCase[data[i5] >> 4];
    result += alphabetUpperCase[data[i5] & 15];
  }
  return result;
}
function decodeHex(data) {
  if (data.length % 2 !== 0) throw new Error("Invalid hex string");
  const result = new Uint8Array(data.length / 2);
  for (let i5 = 0; i5 < data.length; i5 += 2) {
    if (!(data[i5] in decodeMap)) throw new Error("Invalid character");
    if (!(data[i5 + 1] in decodeMap)) throw new Error("Invalid character");
    result[i5 / 2] |= decodeMap[data[i5]] << 4;
    result[i5 / 2] |= decodeMap[data[i5 + 1]];
  }
  return result;
}
function encodeBase64(bytes) {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}
function encodeBase64_internal(bytes, alphabet, padding) {
  let result = "";
  for (let i5 = 0; i5 < bytes.byteLength; i5 += 3) {
    let buffer2 = 0;
    let bufferBitSize = 0;
    for (let j5 = 0; j5 < 3 && i5 + j5 < bytes.byteLength; j5++) {
      buffer2 = buffer2 << 8 | bytes[i5 + j5];
      bufferBitSize += 8;
    }
    for (let j5 = 0; j5 < 4; j5++) if (bufferBitSize >= 6) {
      result += alphabet[buffer2 >> bufferBitSize - 6 & 63];
      bufferBitSize -= 6;
    } else if (bufferBitSize > 0) {
      result += alphabet[buffer2 << 6 - bufferBitSize & 63];
      bufferBitSize = 0;
    } else if (padding === EncodingPadding.Include) result += "=";
  }
  return result;
}
function decodeBase64(encoded) {
  return decodeBase64_internal(encoded, base64DecodeMap, DecodingPadding.Required);
}
function decodeBase64_internal(encoded, decodeMap2, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i5 = 0; i5 < encoded.length; i5 += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j5 = 0; j5 < 4; j5++) {
      if (padding === DecodingPadding.Required && encoded[i5 + j5] === "=") continue;
      if (padding === DecodingPadding.Ignore && (i5 + j5 >= encoded.length || encoded[i5 + j5] === "=")) continue;
      if (j5 > 0 && encoded[i5 + j5 - 1] === "=") throw new Error("Invalid padding");
      if (!(encoded[i5 + j5] in decodeMap2)) throw new Error("Invalid character");
      chunk |= decodeMap2[encoded[i5 + j5]] << (3 - j5) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) unused = chunk & 65535;
      else if (bitsRead === 18) unused = chunk & 255;
      else throw new Error("Invalid padding");
      if (unused !== 0) throw new Error("Invalid padding");
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i6 = 0; i6 < byteLength; i6++) {
      result[totalBytes] = chunk >> 16 - i6 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v4) => typeof v4 === "number");
  return Object.entries(entries).filter(([k4, _4]) => numericValues.indexOf(+k4) === -1).map(([_4, v4]) => v4);
}
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_4, value) {
  if (typeof value === "bigint") return value.toString();
  return value;
}
function cached(getter) {
  return new Cached(getter);
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start2 = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start2, end);
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function rawShape(def) {
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      const value = getter();
      assignProp(this, key, value);
      return value;
    },
    enumerable: true,
    configurable: true
  });
}
function putProp(target, key, value) {
  if (key in target) assignProp(target, key, value);
  else target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  const raw = sourceShape(source);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable) continue;
    if (desc.get) deferProp(target, key, () => {
      const value = source._zod.def.shape[key];
      return wrap ? wrap(value, key) : value;
    });
    else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable) continue;
    if (desc.get) deferProp(target, key, () => source[key]);
    else putProp(target, key, desc.value);
  }
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject(o5) {
  if (isObject(o5) === false) return false;
  const ctor = o5.constructor;
  if (ctor === void 0) return true;
  if (typeof ctor !== "function") return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
  return true;
}
function shallowClone(o5) {
  if (isPlainObject(o5)) return { ...o5 };
  if (Array.isArray(o5)) return [...o5];
  if (o5 instanceof Map) return new Map(o5);
  if (o5 instanceof Set) return new Set(o5);
  return o5;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent) cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params) return {};
  if (typeof params === "string") return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string") return {
    ...params,
    error: () => params.error
  };
  return params;
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint") return value.toString() + "n";
  if (typeof value === "string") return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k4) => {
    return shape[k4]._zod.optin !== void 0 && shape[k4]._zod.optout === "optional";
  });
}
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
  const newShape = {};
  mirrorShape(newShape, schema, maskedKeys(schema, mask));
  return clone(schema, mergeDefs(currDef, {
    shape: newShape,
    checks: []
  }));
}
function maskedKeys(schema, mask) {
  const raw = sourceShape(schema);
  const keys = [];
  for (const key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
    if (mask[key]) keys.push(key);
  }
  return keys;
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
  const omitted = new Set(maskedKeys(schema, mask));
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
  return clone(schema, mergeDefs(currDef, {
    shape: newShape,
    checks: []
  }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
  const checks = schema._zod.def.checks;
  if (checks && checks.length > 0) {
    const existingShape = sourceShape(schema);
    for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
  mirrorProps(newShape, shape);
  return newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a5, b3) {
  if (!b3?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (a5._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  const newShape = {};
  mirrorShape(newShape, a5, Reflect.ownKeys(sourceShape(a5)));
  mirrorShape(newShape, b3, Reflect.ownKeys(sourceShape(b3)));
  return clone(a5, mergeDefs(a5._zod.def, {
    shape: newShape,
    get catchall() {
      return b3._zod.def.catchall;
    },
    checks: b3._zod.def.checks ?? []
  }));
}
function partial(Class, schema, mask, name = "partial") {
  const checks = schema._zod.def.checks;
  if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
    type: "optional",
    innerType: value
  })));
  return clone(schema, mergeDefs(schema._zod.def, {
    shape: newShape,
    checks: []
  }));
}
function required(Class, schema, mask) {
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
    type: "nonoptional",
    innerType: value
  }));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x4, startIndex = 0) {
  if (x4.aborted === true) return true;
  for (let i5 = startIndex; i5 < x4.issues.length; i5++) if (x4.issues[i5]?.continue !== true) return true;
  return false;
}
function explicitlyAborted(x4, startIndex = 0) {
  if (x4.aborted === true) return true;
  for (let i5 = startIndex; i5 < x4.issues.length; i5++) if (x4.issues[i5]?.continue === false) return true;
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a2;
    (_a2 = iss).path ?? (_a2.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start2, inst) {
  var _a2;
  for (let i5 = start2; i5 < issues.length; i5++) (_a2 = issues[i5]).schema ?? (_a2.schema = inst);
}
function finalizeIssue(iss, ctx, config2) {
  var _a2;
  const traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType")) {
    if (traits.has("$ZodCheck")) (_a2 = iss).schema ?? (_a2.schema = iss.inst);
    else iss.schema = iss.inst;
  }
  const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const full = {};
  for (const k4 of Object.keys(iss)) {
    if (k4 === "inst" || k4 === "schema" || k4 === "continue" || k4 === "input" || k4 === "__proto__") continue;
    full[k4] = iss[k4];
  }
  full.path ?? (full.path = []);
  full.message = message;
  if (ctx?.reportInput) full.input = iss.input;
  return full;
}
function codePointLength(str) {
  const units2 = str.length;
  if (!highSurrogate.test(str)) return units2;
  let count = units2;
  for (let i5 = 0; i5 < units2 - 1; i5++) if ((str.charCodeAt(i5) & 64512) === 55296 && (str.charCodeAt(i5 + 1) & 64512) === 56320) {
    count--;
    i5++;
  }
  return count;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input)) return "array";
  if (typeof input === "string") return "string";
  return "unknown";
}
function parsedType(data) {
  const t4 = typeof data;
  switch (t4) {
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "object": {
      if (data === null) return "null";
      if (Array.isArray(data)) return "array";
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
    }
  }
  return t4;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") return {
    message: iss,
    code: "custom",
    input,
    inst
  };
  return { ...iss };
}
function members(proto, table) {
  for (const key in table) {
    const desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get) Object.defineProperty(proto, key, {
      ...desc,
      enumerable: false
    });
    else defineBound(proto, key, desc.value);
  }
}
function own(inst, key, value, enumerable = true) {
  Object.defineProperty(inst, key, {
    configurable: true,
    writable: true,
    enumerable,
    value
  });
  return value;
}
function hide(inst, key, value) {
  return own(inst, key, value, false);
}
function derived(computes, table) {
  for (const key in computes) {
    const compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: true,
      enumerable: true,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  const proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? void 0 : proto;
}
function defineLazyInternal(inst, key, compute) {
  const proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = void 0;
    return;
  }
  installing = inst._zod;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      Object.defineProperty(this, key, breaker);
      const outer = broke;
      broke = false;
      try {
        const value = compute(this);
        if (broke) delete this[key];
        else Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          value
        });
        broke = broke || outer;
        return value;
      } catch (err) {
        delete this[key];
        broke = broke || outer;
        throw err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, {
        configurable: true,
        writable: true,
        value
      });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  const proto = claim(inst, key);
  if (!proto) return;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      const desc = {
        configurable: true,
        writable: true,
        enumerable,
        value: void 0
      };
      Object.defineProperty(this, key, desc);
      desc.value = make(this);
      Object.defineProperty(this, key, desc);
      return desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, {
        configurable: true,
        writable: true,
        enumerable,
        value
      });
    }
  });
}
function constantCatch(value) {
  const fn = () => value;
  fn[CONSTANT_CATCH] = true;
  return fn;
}
function newError(Definition) {
  const E4 = _E;
  if (E4) {
    const saved = E4.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E4.stackTraceLimit = 0;
      } catch {
        _E = null;
        return new Definition();
      }
      try {
        return new Definition();
      } finally {
        E4.stackTraceLimit = saved;
      }
    }
  }
  return new Definition();
}
function $constructor(name, initializer2, proto, params) {
  const zodProto = {};
  function Internals(def) {
    this.def = def;
    this.constr = _4;
    this.traits = /* @__PURE__ */ new Set();
  }
  Internals.prototype = zodProto;
  const protoMembers = proto;
  const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = void 0;
      }
    } else if (inst._zod.traits.has(name)) return;
    inst._zod.traits.add(name);
    initializer2(inst, def);
    if (initialized) {
      const own2 = Object.getPrototypeOf(inst);
      const ctorProto = inst._zod.constr.prototype;
      let up = own2;
      while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
      const target = up ?? own2;
      if (!initialized.has(target)) {
        initialized.add(target);
        members(target, protoMembers);
      }
    }
    const proto2 = _4.prototype;
    for (const k4 in proto2) {
      if (!Object.prototype.hasOwnProperty.call(proto2, k4)) continue;
      if (!(k4 in inst)) inst[k4] = proto2[k4].bind(inst);
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _4(def) {
    const inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    const deferred = inst._zod.deferred;
    if (deferred) {
      for (const fn of deferred) fn();
      inst._zod.deferred = void 0;
    }
    const pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp) pp(inst);
    return inst;
  }
  Object.defineProperty(_4, "init", { value: init });
  Object.defineProperty(_4, Symbol.hasInstance, { value: (inst) => {
    if (params?.Parent && inst instanceof params.Parent) return true;
    return inst?._zod?.traits?.has(name);
  } });
  Object.defineProperty(_4, "name", { value: name });
  return _4;
}
function config(newConfig) {
  if (newConfig) Object.assign(globalConfig, newConfig);
  return globalConfig;
}
function _getMessage() {
  const internals = this._zod;
  internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
  return internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    if (key === "__proto__") Object.defineProperty(obj, key, {
      value: make(),
      writable: true,
      enumerable: true,
      configurable: true
    });
    else obj[key] = make();
  }
  return obj[key];
}
function flattenError(error3, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error3.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
  else formErrors.push(mapper(sub));
  return {
    formErrors,
    fieldErrors
  };
}
function formatError(error3, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error4, path = []) => {
    for (const issue2 of error4.issues) if (issue2.code === "invalid_union" && issue2.errors.length) issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
    else if (issue2.code === "invalid_key") processError({ issues: issue2.issues }, [...path, ...issue2.path]);
    else if (issue2.code === "invalid_element") processError({ issues: issue2.issues }, [...path, ...issue2.path]);
    else {
      const fullpath = [...path, ...issue2.path];
      if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue2));
      else {
        let curr = fieldErrors;
        let i5 = 0;
        while (i5 < fullpath.length) {
          const el = fullpath[i5];
          const terminal = i5 === fullpath.length - 1;
          if (el === "_errors") {
            if (terminal) curr._errors.push(mapper(issue2));
            i5++;
            continue;
          }
          if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
            value: { _errors: [] },
            enumerable: true,
            writable: true,
            configurable: true
          });
          const node2 = curr[el];
          if (terminal) node2._errors.push(mapper(issue2));
          curr = node2;
          i5++;
        }
      }
    }
  };
  processError(error3);
  return fieldErrors;
}
function finalizeParams(callee, params) {
  return {
    callee: params?.callee ?? callee,
    Err: params?.Err
  };
}
function failure(Err, issues, ctx) {
  let error3;
  return {
    success: false,
    get error() {
      if (!error3) {
        error3 = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
        issues = void 0;
        ctx = void 0;
      }
      return error3;
    },
    set error(e4) {
      error3 = e4;
      issues = void 0;
      ctx = void 0;
    }
  };
}
function validateFallback(schema, value, _ctx) {
  const ctx = _ctx ? {
    ..._ctx,
    async: false,
    abortEarly: true
  } : {
    async: false,
    abortEarly: true
  };
  const fallbackRun = schema._zod.bag.fallbackRun;
  let result;
  if (fallbackRun) {
    ctx[COMPILE_FALLBACK] = true;
    result = fallbackRun({
      value,
      issues: []
    }, ctx);
  } else result = schema._zod.run({
    value,
    issues: []
  }, ctx);
  if (result instanceof Promise) throw new $ZodAsyncError();
  return result.issues.length === 0;
}
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
function emoji() {
  return new RegExp(_emoji$1, "u");
}
function anchor(source) {
  return new RegExp(`^${source}$`);
}
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const opts = ["Z"];
  if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const qualified = `${timeSource({
    precision: args.precision,
    seconds: true
  })}(?:${opts.join("|")})`;
  const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
async function validateAsync(inst, value) {
  const ctx = { async: true };
  return toStandardResult(await inst._zod.run({
    value,
    issues: []
  }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      const ctx = { async: false };
      try {
        const r5 = inst._zod.run({
          value,
          issues: []
        }, ctx);
        if (!(r5 instanceof Promise)) return toStandardResult(r5, ctx);
      } catch (_4) {
      }
      return validateAsync(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
function canParseURL(input) {
  try {
    if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
    new URL(input);
    return true;
  } catch {
    return false;
  }
}
function validateURL(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
  return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
  try {
    if (typeof URL !== "undefined") {
      const URLStatic = URL;
      if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
    }
    return new URL(trimmed);
  } catch {
    return 2;
  }
}
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
  hostname.lastIndex = 0;
  return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
  protocol.lastIndex = 0;
  return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value)) return false;
  return canParseURL(`http://[${value}]`);
}
function isValidCIDRv6(value) {
  const parts = value.split("/");
  if (parts.length !== 2) return false;
  const [address, prefix] = parts;
  if (!prefix) return false;
  const prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix) return false;
  if (prefixNum < 0 || prefixNum > 128) return false;
  return isValidIPv6(address);
}
function isValidBase64(data) {
  if (data === "") return true;
  if (/\s/.test(data)) return false;
  if (data.length % 4 !== 0) return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data)) return false;
  const base642 = data.replace(/[-_]/g, (c4) => c4 === "-" ? "+" : "/");
  return isValidBase64(base642.padEnd(Math.ceil(base642.length / 4) * 4, "="));
}
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3) return false;
    const [header] = tokensParts;
    if (!header) return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
    if (!parsedHeader.alg) return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
    return true;
  } catch {
    return false;
  }
}
function handleArrayResult(result, final, index) {
  if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
  final.value[index] = result.value;
}
function handlePropertyResult(result, final, key, input, optin, optout) {
  const isPresent = key in input;
  const isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional") return;
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent) return;
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && optin === void 0) {
    if (!result.issues.length) final.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: void 0,
      path: [key]
    });
    return;
  }
  if (result.value === void 0) {
    if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
  } else final.value[key] = result.value;
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  const ownSymbols = Object.getOwnPropertySymbols(def.shape);
  const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
  const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (const k4 of allKeys) if (!def.shape?.[k4]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k4)}": expected a Zod schema`);
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t4 = _catchall.def.type;
  const optin = _catchall.optin;
  const optout = _catchall.optout;
  let seen = 0;
  for (const key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen)) break;
      seen = payload.issues.length;
    }
    if (keySet.has(key)) continue;
    if (key === "__proto__") {
      if (t4 === "never") unrecognized.push(key);
      continue;
    }
    if (t4 === "never") {
      unrecognized.push(key);
      continue;
    }
    const r5 = _catchall.run({
      value: input[key],
      issues: []
    }, ctx);
    if (r5 instanceof Promise) proms.push(r5.then((r6) => handlePropertyResult(r6, payload, key, input, optin, optout)));
    else handlePropertyResult(r5, payload, key, input, optin, optout);
  }
  if (unrecognized.length) payload.issues.push({
    code: "unrecognized_keys",
    keys: unrecognized,
    input,
    inst,
    continue: true
  });
  if (!proms.length) return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) if (result.issues.length === 0) {
    final.value = result.value;
    return final;
  }
  const nonaborted = results.filter((r5) => !aborted(r5));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
function mergeValues(a5, b3) {
  if (a5 === b3) return {
    valid: true,
    data: a5
  };
  if (a5 instanceof Date && b3 instanceof Date && +a5 === +b3) return {
    valid: true,
    data: a5
  };
  if (isPlainObject(a5) && isPlainObject(b3)) {
    const bKeys = Object.keys(b3);
    const sharedKeys = Object.keys(a5).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = {
      ...a5,
      ...b3
    };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__") continue;
      const sharedValue = mergeValues(a5[key], b3[key]);
      if (!sharedValue.valid) return {
        valid: false,
        mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
      };
      newObj[key] = sharedValue.data;
    }
    return {
      valid: true,
      data: newObj
    };
  }
  if (Array.isArray(a5) && Array.isArray(b3)) {
    if (a5.length !== b3.length) return {
      valid: false,
      mergeErrorPath: []
    };
    const newArray = [];
    for (let index = 0; index < a5.length; index++) {
      const itemA = a5[index];
      const itemB = b3[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) return {
        valid: false,
        mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
      };
      newArray.push(sharedValue.data);
    }
    return {
      valid: true,
      data: newArray
    };
  }
  return {
    valid: false,
    mergeErrorPath: []
  };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  const keyIssues = /* @__PURE__ */ new Map();
  const collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length) {
      unrecIssue ?? (unrecIssue = iss);
      keys = iss.keys;
    } else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      const k4 = String(iss.path[0]);
      if (!keyIssues.has(k4)) keyIssues.set(k4, iss);
      keys = [k4];
    } else return false;
    for (const k4 of keys) {
      if (!unrecKeys.has(k4)) unrecKeys.set(k4, {});
      unrecKeys.get(k4)[side] = true;
    }
    return true;
  };
  for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
  for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
  const bothKeys = [...unrecKeys].filter(([, f5]) => f5.l && f5.r).map(([k4]) => k4);
  if (bothKeys.length) {
    const aggregated = unrecIssue ? bothKeys.filter((k4) => unrecIssue.keys.includes(k4)) : [];
    if (aggregated.length) result.issues.push({
      ...unrecIssue,
      keys: aggregated
    });
    for (const k4 of bothKeys) if (!aggregated.includes(k4) && keyIssues.has(k4)) result.issues.push(keyIssues.get(k4));
  }
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result)) return result;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
function handleOptionalResult(payload, result) {
  payload.value = result.issues.length ? void 0 : result.value;
  return payload;
}
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) payload.value = def.defaultValue;
  return payload;
}
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) payload.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: payload.value,
    inst
  });
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    payload.value = result.value;
    if (result.memo) payload.memo = true;
    return payload;
  }
  payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
    input: payload.value
  });
  return payload;
}
function handlePipeResult(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({
    value: left.value,
    issues: left.issues
  }, ctx);
}
function handleReadonlyResult(payload) {
  if (!payload.memo) payload.value = Object.freeze(payload.value);
  return payload;
}
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params) _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
function isRef(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? {
    ...iss,
    path: iss.path.slice()
  } : { ...iss });
}
function isRecursive(inst, stack, resolve) {
  const cached2 = recursive.get(inst);
  if (cached2 !== void 0) return cached2 ? PROVEN : NONE;
  if (stack.has(inst)) return PROVEN;
  stack.add(inst);
  let result = NONE;
  const check2 = (child) => {
    if (result !== PROVEN && child?._zod) {
      const answer = isRecursive(child, stack, resolve);
      if (answer > result) result = answer;
    }
  };
  const shape = (sh, spread) => {
    let answer = NONE;
    for (const key of Reflect.ownKeys(sh)) {
      const desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable) continue;
      const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
      if (child > answer) answer = child;
    }
    return answer;
  };
  const merge2 = (answer) => {
    if (answer > result) result = answer;
  };
  const def = inst._zod.def;
  switch (def.type) {
    case "object": {
      const raw = rawShape(def);
      merge2(raw ? shape(raw, true) : ASSUMED);
      check2(def.catchall);
      break;
    }
    case "array":
      check2(def.element);
      break;
    case "tuple":
      for (const el of def.items) check2(el);
      check2(def.rest);
      break;
    case "record":
    case "map":
      check2(def.keyType);
      check2(def.valueType);
      break;
    case "set":
      check2(def.valueType);
      break;
    case "union":
      for (const el of def.options) check2(el);
      break;
    case "intersection":
      check2(def.left);
      check2(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check2(def.innerType);
      break;
    case "pipe":
      check2(def.in);
      check2(def.out);
      break;
    case "function":
      check2(def.input);
      check2(def.output);
      break;
    case "lazy": {
      const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
      merge2(inner ? isRecursive(inner, stack, false) : ASSUMED);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (const key in def) {
        const desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get) continue;
        const value = desc.value;
        if (!value || typeof value !== "object") continue;
        if (value._zod) check2(value);
        else if (Array.isArray(value)) for (const el of value) check2(el);
      }
  }
  stack.delete(inst);
  return settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket) {
    bucket = /* @__PURE__ */ new WeakMap();
    state.buckets.set(inst, bucket);
  }
  return bucket;
}
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  const backEdges = ctx[STATE]?.backEdges;
  return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
function en_default() {
  return { localeError: error() };
}
function registry() {
  return new $ZodRegistry();
}
function snapshotChecks(def) {
  if (def.checks) def.checks = [...def.checks];
  return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
  return new Class(snapshotChecks({
    type: "string",
    ...normalizeParams(params)
  }));
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
  return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  return new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  return new Class({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
  return new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue$2) => {
      if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
      else {
        const _issue = issue$2;
        if (_issue.fatal) _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue)) _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
function assignProps(target, ...sources) {
  for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
  return target;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4") target = "draft-04";
  if (target === "draft-7") target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? void 0
  };
}
function handleUnrepresentable(schema, ctx, json, params, message) {
  const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
    zodSchema: schema,
    path: params.path,
    message
  }) : ctx.unrepresentable;
  if (result === "any") return false;
  if (result === void 0 || result === "throw") throw new Error(message);
  Object.assign(json, result);
  return true;
}
function processSchema(schema, ctx, _params = {
  path: [],
  schemaPath: []
}) {
  var _a2;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
    return seen.schema;
  }
  const result = {
    schema: {},
    count: 1,
    cycle: void 0,
    path: _params.path
  };
  ctx.seen.set(schema, result);
  ctx.sharedDefsExtractedFor = void 0;
  ctx.sharedEmitDoneFor = void 0;
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) result.schema = overrideSchema;
  else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
    else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref) result.ref = parent;
      processSchema(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta) assignProps(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema) (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
  delete result.schema._prefault;
  return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) return { ref: uriGenerator(externalId) };
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return {
        defId: id,
        ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
      };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return {
      defId,
      ref: defUriPrefix + encodeJSONPointerSegment(defId)
    };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) return;
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId) seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) delete schema2[key];
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    if (ctx.metadataRegistry.get(entry[0])?.id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") extractToDef(entry);
    }
  }
  if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  const options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
  const types2 = [];
  for (const option of options) {
    if (!option || typeof option !== "object") return;
    compactTypeUnion(option);
    const keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type") return;
    const type = option.type;
    for (const member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string") return;
      if (!types2.includes(member)) types2.push(member);
    }
  }
  delete schema.anyOf;
  schema.type = types2.length === 1 ? types2[0] : types2;
}
function undeclaredConstraint(member) {
  const extra = member.additionalProperties;
  if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members2) {
  const objects = [];
  for (const member of members2) {
    if (typeof member !== "object" || member.type !== "object") return null;
    for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
    objects.push(member);
  }
  const properties = {};
  const required2 = /* @__PURE__ */ new Set();
  for (const object2 of objects) {
    for (const key in object2.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
      const parts = [];
      for (const other of objects) {
        const part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === void 0) continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
      }
      assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
    }
    for (const key of object2.required ?? []) required2.add(key);
  }
  const folded = {
    type: "object",
    properties
  };
  if (required2.size) folded.required = [...required2];
  if (objects.every((object2) => object2.additionalProperties === false)) folded.additionalProperties = false;
  else {
    const constraints = [];
    for (const object2 of objects) {
      const constraint = undeclaredConstraint(object2);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
    }
    if (constraints.length === 1) folded.additionalProperties = constraints[0];
    else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json) {
  const allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2) return;
  for (const key of FOLDABLE_KEYS) if (key in json) return;
  const unions = allOf.filter((m4) => UNION_KEYS.some((k4) => Array.isArray(m4[k4])));
  let folded = null;
  if (!unions.length) folded = foldObjects(allOf);
  else {
    const union2 = unions[0];
    const keyword = UNION_KEYS.find((k4) => Array.isArray(union2[k4]));
    if (Object.keys(union2).length !== 1) return;
    const rest = allOf.filter((m4) => m4 !== union2);
    const branches = union2[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b3) => !b3)) return;
    folded = { [keyword]: branches };
  }
  if (!folded) return;
  delete json.allOf;
  assignProps(json, folded);
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null) return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else assignProps(schema2, refSchema);
      assignProps(schema2, _cached);
      if (zodSchema._zod.parent === ref) for (const key in schema2) {
        if (key === "$ref" || key === "allOf") continue;
        if (!(key in _cached)) delete schema2[key];
      }
      if (refSchema.$ref && refSeen.def) for (const key in schema2) {
        if (key === "$ref" || key === "allOf") continue;
        if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) delete schema2[key];
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) for (const key in schema2) {
          if (key === "$ref" || key === "allOf") continue;
          if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) delete schema2[key];
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
    if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
    for (const rewrite of ctx.deferred) rewrite();
    if (ctx.intersections.length) {
      const carriers = /* @__PURE__ */ new Map();
      for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
        const allOf = json?.allOf;
        if (!Array.isArray(allOf)) continue;
        const existing = carriers.get(allOf);
        if (existing) existing.push(json);
        else carriers.set(allOf, [json]);
      }
      for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
    }
  }
  const result = {};
  if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
  else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
  else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
  else if (ctx.target === "openapi-3.0") {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id) throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
  const defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId) delete seen.def.id;
      assignProp(defs, seen.defId, seen.def);
    }
  }
  if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external) {
  } else if (Object.keys(defs).length > 0) {
    if (ctx.target === "draft-2020-12") result.$defs = defs;
    else result.definitions = defs;
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema)) return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform") return true;
  if (def.type === "array") return isTransforming(def.element, ctx);
  if (def.type === "set") return isTransforming(def.valueType, ctx);
  if (def.type === "lazy") return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
  if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec")) return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) if (isTransforming(option, ctx)) return true;
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) if (isTransforming(item, ctx)) return true;
    if (def.rest && isTransforming(def.rest, ctx)) return true;
    return false;
  }
  return false;
}
function aggregateChecks(schema) {
  const agg = {};
  const def = schema._zod.def;
  const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  const bag = schema._zod.bag;
  if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
  if (bag.format !== void 0) {
    agg.format ?? (agg.format = bag.format);
    if (bag.format.includes("int")) agg.isInt = true;
  }
  if (bag.mime) intersectMime(agg, bag.mime);
  for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
  return agg;
}
function inputOptin(schema) {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
  if (def.type === "catch") return inputOptin(def.innerType);
  return schema._zod.optin;
}
function serializeDefaultValue(value, schema, ctx, json, params) {
  let unrepresentable = false;
  const serialized = JSON.stringify(value, (_4, val) => {
    if (typeof val !== "bigint") return val;
    unrepresentable = true;
    return null;
  });
  if (!unrepresentable) return JSON.parse(serialized);
  handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
  return UNREPRESENTABLE_DEFAULT;
}
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: false,
    get() {
      const value = make(this);
      Object.defineProperty(this, key, {
        value,
        configurable: true,
        writable: true
      });
      return value;
    },
    set(value) {
      Object.defineProperty(this, key, {
        value,
        configurable: true,
        writable: true
      });
    }
  });
}
function _ensureDefaultLocale() {
  if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
function string(params) {
  return /* @__PURE__ */ _string(ZodString, params);
}
function unknown() {
  return /* @__PURE__ */ _unknown(ZodUnknown);
}
function never(params) {
  return /* @__PURE__ */ _never(ZodNever, params);
}
function array(element, params) {
  return /* @__PURE__ */ _array(ZodArray, element, params);
}
function object(shape, params) {
  return new ZodObject({
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  });
}
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
function _enum(values, params) {
  return new ZodEnum({
    type: "enum",
    entries: Array.isArray(values) ? Object.fromEntries(values.map((v4) => [v4, v4])) : values,
    ...normalizeParams(params)
  });
}
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
  });
}
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
function custom(fn, _params) {
  return /* @__PURE__ */ _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return /* @__PURE__ */ _superRefine(fn, params);
}
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes.buffer, ALGORITHM, true, ["encrypt", "decrypt"]);
}
async function encryptString(key, raw, additionalData) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder$1.encode(raw);
  const params = {
    name: ALGORITHM,
    iv
  };
  if (additionalData) params.additionalData = encoder$1.encode(additionalData);
  const buffer2 = await crypto.subtle.encrypt(params, key, data);
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer2));
}
async function decryptString(key, encoded, additionalData) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const params = {
    name: ALGORITHM,
    iv
  };
  if (additionalData) params.additionalData = encoder$1.encode(additionalData);
  const decryptedBuffer = await crypto.subtle.decrypt(params, key, dataArray);
  return decoder$1.decode(decryptedBuffer);
}
async function generateCspDigest(data, algorithm) {
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder$1.encode(data));
  const hash = encodeBase64(new Uint8Array(hashBuffer));
  return `${ALGORITHMS[algorithm]}${hash}`;
}
function isRoute404(route) {
  return ROUTE404_RE.test(route);
}
function isRoute500(route) {
  return ROUTE500_RE.test(route);
}
function createError(name) {
  return new AstroError({
    ...UnavailableAstroGlobal,
    message: UnavailableAstroGlobal.message(name)
  });
}
function createAstro(site) {
  return {
    get site() {
      console.warn(`Astro.site inside getStaticPaths is deprecated and will be removed in a future major version of Astro. Use import.meta.env.SITE instead`);
      return site ? new URL(site) : void 0;
    },
    get generator() {
      console.warn(`Astro.generator inside getStaticPaths is deprecated and will be removed in a future major version of Astro.`);
      return ASTRO_GENERATOR;
    },
    get callAction() {
      throw createError("callAction");
    },
    get clientAddress() {
      throw createError("clientAddress");
    },
    get cookies() {
      throw createError("cookies");
    },
    get csp() {
      throw createError("csp");
    },
    get currentLocale() {
      throw createError("currentLocale");
    },
    get getActionResult() {
      throw createError("getActionResult");
    },
    get isPrerendered() {
      throw createError("isPrerendered");
    },
    get locals() {
      throw createError("locals");
    },
    get originPathname() {
      throw createError("originPathname");
    },
    get params() {
      throw createError("params");
    },
    get preferredLocale() {
      throw createError("preferredLocale");
    },
    get preferredLocaleList() {
      throw createError("preferredLocaleList");
    },
    get props() {
      throw createError("props");
    },
    get redirect() {
      throw createError("redirect");
    },
    get request() {
      throw createError("request");
    },
    get response() {
      throw createError("response");
    },
    get rewrite() {
      throw createError("rewrite");
    },
    get routePattern() {
      throw createError("routePattern");
    },
    get self() {
      throw createError("self");
    },
    get slots() {
      throw createError("slots");
    },
    get url() {
      throw createError("url");
    },
    get session() {
      throw createError("session");
    },
    get cache() {
      throw createError("cache");
    },
    get logger() {
      throw createError("logger");
    }
  };
}
async function renderEndpoint(mod, context, isPrerendered, logger, state) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) handler = mod["GET"];
  if (isPrerendered && !["GET", "HEAD"].includes(method)) logger.warn("router", `${url.pathname} ${s.bold(method)} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`);
  if (handler === void 0) {
    logger.warn("router", `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : ""));
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error("router", `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`);
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) throw new AstroError(EndpointDidNotReturnAResponse);
  if (state && REROUTABLE_STATUS_CODES.includes(response.status)) state.skipErrorReroute = true;
  if (method === "HEAD") return new Response(null, response);
  return response;
}
function isPromise(value) {
  return typeof value === "object" && value !== null && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function entityFor(code) {
  switch (code) {
    case 38:
      return "&amp;";
    case 60:
      return "&lt;";
    case 62:
      return "&gt;";
    case 39:
      return "&#39;";
    default:
      return "&quot;";
  }
}
function escapeHTML(value) {
  ESCAPABLE.lastIndex = 0;
  if (!ESCAPABLE.test(value)) return value;
  let output = "";
  let last = 0;
  do {
    const index = ESCAPABLE.lastIndex - 1;
    if (last !== index) output += value.slice(last, index);
    output += entityFor(value.charCodeAt(index));
    last = index + 1;
  } while (ESCAPABLE.test(value));
  return last === value.length ? output : output + value.slice(last);
}
function stringifyForScript(value) {
  return JSON.stringify(value)?.replace(/</g, "\\u003c");
}
function escapeStyleText(value) {
  return value.replaceAll("<", "\\3C ");
}
function isHTMLString(value) {
  return typeof value === "object" && value !== null && value[htmlStringSymbol] === true;
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) for await (const chunk of streamAsyncIterator(iterable)) yield unescapeHTML(chunk);
  else for await (const chunk of iterable) yield unescapeHTML(chunk);
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) yield unescapeHTML(chunk);
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) return markHTMLBytes(str);
    else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") return Promise.resolve(str).then((value) => {
      return unescapeHTML(value);
    });
    else if (str[/* @__PURE__ */ Symbol.for("astro:slot-string")]) return str;
    else if (Symbol.iterator in str) return unescapeChunks(str);
    else if (Symbol.asyncIterator in str || hasGetReader(str)) return unescapeChunksAsync(str);
  }
  return markHTMLString(str);
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode["astro:jsx"];
}
function isPropagatingHint(hint) {
  return hint === "self" || hint === "in-tree";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function r(e4) {
  var t4, f5, n3 = "";
  if ("string" == typeof e4 || "number" == typeof e4) n3 += e4;
  else if ("object" == typeof e4) if (Array.isArray(e4)) {
    var o5 = e4.length;
    for (t4 = 0; t4 < o5; t4++) e4[t4] && (f5 = r(e4[t4])) && (n3 && (n3 += " "), n3 += f5);
  } else for (f5 in e4) e4[f5] && (n3 && (n3 += " "), n3 += f5);
  return n3;
}
function clsx() {
  for (var e4, t4, f5 = 0, n3 = "", o5 = arguments.length; f5 < o5; f5++) (e4 = arguments[f5]) && (t4 = r(e4)) && (n3 && (n3 += " "), n3 += t4);
  return n3;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  parents.add(value);
  const serialized = value.map((v4) => {
    return convertToSerializedForm(v4, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  parents.add(value);
  const serialized = Object.fromEntries(Object.entries(value).map(([k4, v4]) => {
    return [k4, convertToSerializedForm(v4, metadata, parents)];
  }));
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  switch (Object.prototype.toString.call(value)) {
    case "[object Date]":
      return [PROP_TYPE.Date, value.toISOString()];
    case "[object RegExp]":
      return [PROP_TYPE.RegExp, value.source];
    case "[object Map]":
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    case "[object Set]":
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    case "[object BigInt]":
      return [PROP_TYPE.BigInt, value.toString()];
    case "[object URL]":
      return [PROP_TYPE.URL, value.toString()];
    case "[object Array]":
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    case "[object Uint8Array]":
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    case "[object Uint16Array]":
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    case "[object Uint32Array]":
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    default:
      if (value !== null && typeof value === "object") return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      if (value === Number.POSITIVE_INFINITY) return [PROP_TYPE.Infinity, 1];
      if (value === Number.NEGATIVE_INFINITY) return [PROP_TYPE.Infinity, -1];
      if (value === void 0) return [PROP_TYPE.Value];
      return [PROP_TYPE.Value, value];
  }
}
function serializeProps(props, metadata) {
  return JSON.stringify(serializeObject(props, metadata));
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const key of Object.keys(inputProps)) {
    const value = inputProps[key];
    if (key.startsWith("server:")) {
      if (key === "server:root") extracted.isPage = true;
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) extracted.hydration = {
        directive: "",
        value: "",
        componentUrl: "",
        componentExport: { value: "" }
      };
      switch (key) {
        case "client:component-path":
          extracted.hydration.componentUrl = value;
          break;
        case "client:component-export":
          extracted.hydration.componentExport.value = value;
          break;
        case "client:component-hydration":
          break;
        case "client:display-name":
          break;
        default:
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d4) => `client:${d4}`).join(", ");
            throw new Error(`Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`);
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") throw new AstroError(MissingMediaQueryDirective);
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.has(key)) extracted.propsWithoutTransitionAttributes[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) throw new AstroError({
    ...NoMatchingImport,
    message: NoMatchingImport.message(metadata.displayName)
  });
  const island = {
    children: "",
    props: { uid: astroId }
  };
  if (attrs) for (const [key, value] of Object.entries(attrs)) island.props[key] = escapeHTML(String(value));
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint.toString()));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) island.props["before-hydration-url"] = beforeHydrationUrl;
  island.props["opts"] = escapeHTML(JSON.stringify({
    name: metadata.displayName,
    value: metadata.hydrateArgs || ""
  }));
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") island.props[name] = escapeHTML(String(props[name]));
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i5 = 0; i5 < str.length; i5++) {
    const ch = str.charCodeAt(i5);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) result = dictionary[integer] + result;
  return sign + result;
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createThinHead() {
  return { [headAndContentSym]: true };
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.templateDepth > 0) return !result._metadata.hasHydrationScript;
  if (result._metadata.hasHydrationScript) return false;
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.templateDepth > 0) return !result._metadata.hasDirectives.has(directive);
  if (result._metadata.hasDirectives.has(directive)) return false;
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirective = result.clientDirectives.get(directive);
  if (!clientDirective) throw new Error(`Unknown directive: ${directive}`);
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `<style>${ISLAND_STYLES}</style><script>${getDirectiveScriptText(result, directive)}</script><script>${process.env.NODE_ENV === "development" ? astro_island_prebuilt_dev_default : astro_island_prebuilt_default}</script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}</script>`;
  }
}
async function collectPropagatedHeadParts(input) {
  const collectedHeadParts = [];
  const pendingSlotEvaluations = input.awaitPendingSlots === false ? [] : input.result._metadata?.pendingSlotEvaluations ?? [];
  const drainPendingSlots = async () => {
    while (pendingSlotEvaluations.length > 0) {
      const batch = pendingSlotEvaluations.splice(0, pendingSlotEvaluations.length);
      await Promise.all(batch);
    }
  };
  await drainPendingSlots();
  for (const propagator of input.propagators) {
    const returnValue = await propagator.init(input.result);
    if (input.isHeadAndContent(returnValue) && returnValue.head) collectedHeadParts.push(returnValue.head);
    await drainPendingSlots();
  }
  return collectedHeadParts;
}
function shouldRenderHeadInstruction(state) {
  return !state.hasRenderedHead && !state.partial;
}
function shouldRenderMaybeHeadInstruction(state) {
  return !state.hasRenderedHead && !state.headInTree && !state.partial;
}
function shouldRenderInstruction$1(type, state) {
  return type === "head" ? shouldRenderHeadInstruction(state) : shouldRenderMaybeHeadInstruction(state);
}
function registerIfPropagating(result, factory, instance) {
  if (factory.propagation === "self" || factory.propagation === "in-tree") {
    result._metadata.propagators.add(instance);
    return;
  }
  if (factory.moduleId) {
    const hint = result.componentMetadata.get(factory.moduleId)?.propagation;
    if (isPropagatingHint(hint ?? "none")) result._metadata.propagators.add(instance);
  }
}
async function bufferPropagatedHead(result, options = {}) {
  const collected = await collectPropagatedHeadParts({
    propagators: result._metadata.propagators,
    result,
    isHeadAndContent,
    awaitPendingSlots: options.awaitPendingSlots
  });
  result._metadata.extraHead.push(...collected);
}
function shouldRenderInstruction(type, state) {
  return shouldRenderInstruction$1(type, state);
}
function getInstructionRenderState(result) {
  return {
    hasRenderedHead: result._metadata.hasRenderedHead,
    headInTree: result._metadata.headInTree,
    partial: result.partial
  };
}
function normalizeCspResourceEntry(entry) {
  if (typeof entry === "string") return {
    resource: entry,
    kind: "default"
  };
  return {
    resource: entry.resource,
    kind: entry.kind ?? "default"
  };
}
function normalizeCspHashEntry(entry) {
  if (typeof entry === "string") return {
    hash: entry,
    kind: "default"
  };
  return {
    hash: entry.hash,
    kind: entry.kind ?? "default"
  };
}
function partitionByKind(directive) {
  const groups = {
    default: {
      resources: [],
      hashes: []
    },
    element: {
      resources: [],
      hashes: []
    },
    attribute: {
      resources: [],
      hashes: []
    }
  };
  for (const entry of directive.resources) {
    const { resource, kind } = normalizeCspResourceEntry(entry);
    groups[kind].resources.push(resource);
  }
  for (const entry of directive.hashes) {
    const { hash, kind } = normalizeCspHashEntry(entry);
    groups[kind].hashes.push(hash);
  }
  return groups;
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) return;
  return `${directiveName} ${Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues])).join(" ")}`;
}
function pushDirective(directives, newDirective) {
  if (directives.length === 0) return [newDirective];
  const finalDirectives = [];
  let matched = false;
  for (const directive of directives) {
    if (matched) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      matched = true;
    } else finalDirectives.push(directive);
  }
  if (!matched) finalDirectives.push(newDirective);
  return finalDirectives;
}
function renderCspContent(result) {
  const { scriptDirective, styleDirective, directives } = result;
  const script = partitionByKind(scriptDirective);
  const style = partitionByKind(styleDirective);
  const finalScriptHashes = /* @__PURE__ */ new Set();
  for (const scriptHash of script.default.hashes) finalScriptHashes.add(`'${scriptHash}'`);
  for (const scriptHash of result._metadata.extraScriptHashes) finalScriptHashes.add(`'${scriptHash}'`);
  const finalStyleHashes = /* @__PURE__ */ new Set();
  for (const styleHash of style.default.hashes) finalStyleHashes.add(`'${styleHash}'`);
  for (const styleHash of result._metadata.extraStyleHashes) finalStyleHashes.add(`'${styleHash}'`);
  let directivesContent;
  if (directives.length > 0) directivesContent = directives.join(";") + ";";
  const scriptResources = script.default.resources.length > 0 ? script.default.resources.join(" ") : "'self'";
  const styleResources = style.default.resources.length > 0 ? style.default.resources.join(" ") : "'self'";
  const scriptElementDefaultResource = script.default.resources.length > 0 ? "" : "'self'";
  const styleElementDefaultResource = style.default.resources.length > 0 ? "" : "'self'";
  const scriptElemActive = isEnabled(script.element);
  const styleElemActive = isEnabled(style.element);
  const strictDynamicSuffix = scriptDirective.strictDynamic ? ` 'strict-dynamic'` : "";
  const scriptDefaultHasUnsafeInline = hasUnsafeInline(script.default.resources);
  const styleDefaultHasUnsafeInline = hasUnsafeInline(style.default.resources);
  const scriptSrc = `script-src ${scriptResources} ${[...scriptElemActive || scriptDefaultHasUnsafeInline ? [] : [...finalScriptHashes], ...scriptDirective.strictDynamic ? [`'strict-dynamic'`] : []].join(" ")};`;
  const styleSrc = `style-src ${styleResources} ${(styleElemActive || styleDefaultHasUnsafeInline ? [] : [...finalStyleHashes]).join(" ")};`;
  const scriptSrcElem = scriptElemActive ? renderSpecificDirective("script-src-elem", script.element.resources, scriptElementDefaultResource, finalScriptHashes, script.element.hashes, strictDynamicSuffix) : void 0;
  const scriptSrcAttr = isEnabled(script.attribute) ? renderSpecificDirective("script-src-attr", script.attribute.resources, "'none'", void 0, script.attribute.hashes) : void 0;
  const styleSrcElem = styleElemActive ? renderSpecificDirective("style-src-elem", style.element.resources, styleElementDefaultResource, finalStyleHashes, style.element.hashes) : void 0;
  const styleSrcAttr = isEnabled(style.attribute) ? renderSpecificDirective("style-src-attr", style.attribute.resources, "'none'", void 0, style.attribute.hashes) : void 0;
  return [
    directivesContent,
    scriptSrc,
    scriptSrcElem,
    scriptSrcAttr,
    styleSrc,
    styleSrcElem,
    styleSrcAttr
  ].filter(Boolean).join(" ");
}
function hasUnsafeInline(resources) {
  return resources.includes("'unsafe-inline'");
}
function isEnabled(sources) {
  return sources.resources.length > 0 || sources.hashes.length > 0;
}
function renderSpecificDirective(name, resources, defaultResource, sharedHashes, ownHashes, suffix = "") {
  const unsafeInline = hasUnsafeInline(resources);
  const hashes = new Set(unsafeInline ? void 0 : sharedHashes);
  if (!unsafeInline) for (const hash of ownHashes) hashes.add(`'${hash}'`);
  let finalResources;
  if (resources.length > 0) finalResources = resources.map((r5) => `${r5}`).join(" ");
  else if (defaultResource === "'none'" && hashes.size > 0) finalResources = "";
  else finalResources = defaultResource;
  return `${name} ${[finalResources, ...hashes].filter(Boolean).join(" ")}${suffix};`;
}
function createRenderInstruction(instruction) {
  instruction[RenderInstructionSymbol] = true;
  return instruction;
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function isScriptInstruction(chunk) {
  return chunk && typeof chunk === "object" && "type" in chunk && chunk.type === "script";
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) output += `const ${toIdent(key)} = ${stringifyForScript(value)};
`;
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function isCustomElement(tagName) {
  return tagName.includes("-");
}
function handleBooleanAttribute(key, value, shouldEscape, tagName) {
  if (key === "popover") return markHTMLString(value ? ` ${key}` : "");
  if (tagName && isCustomElement(tagName)) return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  return markHTMLString(value ? ` ${key}` : "");
}
function classifyAttribute(key) {
  if (INVALID_ATTR_NAME_CHAR.test(key)) return ATTRIBUTE_KIND.INVALID_NAME;
  if (STATIC_DIRECTIVES.has(key)) return ATTRIBUTE_KIND.STATIC_DIRECTIVE;
  if (key === "class:list") return ATTRIBUTE_KIND.CLASS_LIST;
  if (key === "style") return ATTRIBUTE_KIND.STYLE;
  if (key === "className") return ATTRIBUTE_KIND.CLASS_NAME;
  if (htmlBooleanAttributes.test(key)) return ATTRIBUTE_KIND.BOOLEAN;
  if (key === "popover" || key === "download" || key === "hidden") return ATTRIBUTE_KIND.BOOLEAN_IF_BOOLEAN;
  return ATTRIBUTE_KIND.ORDINARY;
}
function addAttribute(value, key, shouldEscape = true, tagName = "") {
  if (value == null) return "";
  switch (classifyAttribute(key)) {
    case ATTRIBUTE_KIND.INVALID_NAME:
      return "";
    case ATTRIBUTE_KIND.STATIC_DIRECTIVE:
      console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
      return "";
    case ATTRIBUTE_KIND.CLASS_LIST: {
      const listValue = toAttributeString(clsx(value), shouldEscape);
      if (listValue === "") return "";
      return markHTMLString(` class="${listValue}"`);
    }
    case ATTRIBUTE_KIND.STYLE:
      if (!(value instanceof HTMLString)) {
        if (Array.isArray(value) && value.length === 2) return markHTMLString(` style="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`);
        if (typeof value === "object") return markHTMLString(` style="${toAttributeString(toStyleString(value), shouldEscape)}"`);
      }
      break;
    case ATTRIBUTE_KIND.CLASS_NAME:
      return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
    case ATTRIBUTE_KIND.BOOLEAN:
      return handleBooleanAttribute(key, value, shouldEscape, tagName);
    case ATTRIBUTE_KIND.BOOLEAN_IF_BOOLEAN:
      if (typeof value === "boolean") return handleBooleanAttribute(key, value, shouldEscape, tagName);
      break;
    case ATTRIBUTE_KIND.ORDINARY:
  }
  if (value === "") return markHTMLString(` ${key}`);
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function spreadElementAttributes(values) {
  let output = "";
  for (const key of Object.keys(values)) {
    if (key === "children") continue;
    output += addAttribute(values[key], key, true);
  }
  return output;
}
function internalSpreadAttributes(values, shouldEscape = true, tagName) {
  let output = "";
  for (const key of Object.keys(values)) output += addAttribute(values[key], key, shouldEscape, tagName);
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _4, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children === "") && voidElementNames.test(name)) return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>`;
  return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>${children}</${name}>`;
}
function createBufferedRenderer(destination, renderFunction) {
  return new BufferedRenderer(destination, renderFunction);
}
function promiseWithResolvers() {
  let resolve, reject;
  return {
    promise: new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    }),
    resolve,
    reject
  };
}
function stablePropsKey(props) {
  const keys = Object.keys(props).sort();
  let result = "{";
  for (let i5 = 0; i5 < keys.length; i5++) {
    if (i5 > 0) result += ",";
    result += JSON.stringify(keys[i5]) + ":" + JSON.stringify(props[keys[i5]]);
  }
  result += "}";
  return result;
}
function deduplicateElements(elements) {
  if (elements.length <= 1) return elements;
  const seen = /* @__PURE__ */ new Set();
  return elements.filter((item) => {
    const key = stablePropsKey(item.props) + item.children;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  let content = "";
  if (result.shouldInjectCspMetaTags && result.cspDestination === "meta") content += renderElement$1("meta", {
    props: {
      "http-equiv": "content-security-policy",
      content: renderCspContent(result)
    },
    children: ""
  }, false);
  const styles = deduplicateElements(Array.from(result.styles)).map((style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style));
  result.styles.clear();
  const scripts = deduplicateElements(Array.from(result.scripts)).map((script) => {
    if (result.userAssetsBase) script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
    return renderElement$1("script", script, false);
  });
  const links = deduplicateElements(Array.from(result.links)).map((link) => renderElement$1("link", link, false));
  const sep = result.compressHTML === true || result.compressHTML === "jsx" ? "" : "\n";
  content += styles.join(sep) + links.join(sep) + scripts.join(sep);
  if (result.speculationRulesContent) content += renderElement$1("script", {
    props: { type: "speculationrules" },
    children: result.speculationRulesContent
  }, false);
  content += result._metadata.extraHead.join("");
  return markHTMLString(content);
}
function renderHead() {
  return HEAD_INSTRUCTION;
}
function maybeRenderHead() {
  return MAYBE_HEAD_INSTRUCTION;
}
function markHtmlParts(htmlParts) {
  let marked = markedHtmlParts.get(htmlParts);
  if (marked === void 0) {
    marked = new Array(htmlParts.length);
    for (let i5 = 0; i5 < htmlParts.length; i5++) marked[i5] = htmlParts[i5] ? markHTMLString(htmlParts[i5]) : htmlParts[i5];
    markedHtmlParts.set(htmlParts, marked);
  }
  return marked;
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
function isSlotString(str) {
  return !!str[slotString];
}
function mergeSlotInstructions(target, source) {
  if (source.instructions?.length) {
    target ??= [];
    target.push(...source.instructions);
  }
  return target;
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) return renderSlot(result, fallback);
  return new SlotRenderInstance(result, slotted);
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const chunks = [];
  await renderSlot(result, slotted, fallback).render({ write(chunk) {
    if (chunk instanceof SlotString) {
      content += chunk;
      if (chunk.chunks.length) chunks.push(...chunk.chunks);
      instructions = mergeSlotInstructions(instructions, chunk);
    } else if (chunk instanceof Response) return;
    else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
      if (isScriptInstruction(chunk)) chunks.push(chunk);
      else {
        if (instructions === null) instructions = [];
        instructions.push(chunk);
      }
    } else {
      const str = chunkToString(result, chunk);
      content += str;
      chunks.push(str);
    }
  } });
  return markHTMLString(new SlotString(content, instructions, chunks));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) await Promise.all(Object.entries(slots).map(([key, value]) => renderSlotToString(result, value).then((output) => {
    if (output.instructions) {
      if (slotInstructions === null) slotInstructions = [];
      slotInstructions.push(...output.instructions);
    }
    if (output.chunks) {
      for (const part of output.chunks) if (typeof part !== "string") {
        if (slotInstructions === null) slotInstructions = [];
        slotInstructions.push(part);
      }
    }
    children[key] = output;
  })));
  return {
    slotInstructions,
    children
  };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function createSearchParams(encryptedComponentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", encryptedComponentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  return (pathname + "?" + params.toString()).length < 2048;
}
function stringifyChunk(result, chunk) {
  if (typeof chunk === "string") return chunk;
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        const needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        const needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        if (needsHydrationScript) return markHTMLString(getPrescripts(result, "both", hydration.directive));
        else if (needsDirectiveScript) return markHTMLString(getPrescripts(result, "directive", hydration.directive));
        else return "";
      }
      case "head":
        if (!shouldRenderInstruction("head", getInstructionRenderState(result))) return "";
        return renderAllHeadContent(result);
      case "maybe-head":
        if (!shouldRenderInstruction("maybe-head", getInstructionRenderState(result))) return "";
        return renderAllHeadContent(result);
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (result._metadata.templateDepth > 0) return instruction.render();
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      case "server-island-runtime":
        if (result._metadata.templateDepth > 0) return renderServerIslandRuntime();
        if (result._metadata.hasRenderedServerIslandRuntime) return "";
        result._metadata.hasRenderedServerIslandRuntime = true;
        return renderServerIslandRuntime();
      case "script": {
        const { id, content } = instruction;
        if (result._metadata.templateDepth > 0) return content;
        if (result._metadata.renderedScripts.has(id)) return "";
        result._metadata.renderedScripts.add(id);
        return content;
      }
      case "template-enter":
        result._metadata.templateDepth++;
        return "";
      case "template-exit":
        if (result._metadata.templateDepth <= 0) throw new Error("Unexpected template-exit instruction without a matching template-enter. This may indicate that the compiler emitted unbalanced template boundaries, or that a component manually injected a template-exit render instruction.");
        result._metadata.templateDepth--;
        return "";
      default:
        throw new Error(`Unknown chunk type: ${chunk.type}`);
    }
  } else if (chunk instanceof Response) return "";
  else if (isSlotString(chunk)) {
    let out = "";
    const c4 = chunk;
    if (c4.instructions) for (const instr of c4.instructions) out += stringifyChunk(result, instr);
    if (c4.chunks.length) for (const part of c4.chunks) out += typeof part === "string" ? part : stringifyChunk(result, part);
    else out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) return decoder.decode(chunk);
  else return stringifyChunk(result, chunk);
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) return chunk;
  else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function chunkToByteArrayOrString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) return chunk;
  else return stringifyChunk(result, chunk).toString();
}
function isRenderInstance(obj) {
  return typeof obj === "object" && obj !== null && typeof obj.render === "function";
}
function renderChild(destination, child) {
  if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
    return;
  }
  if (isRenderInstruction(child)) {
    destination.write(child);
    return;
  }
  if (isPromise(child)) return child.then((x4) => renderChild(destination, x4));
  if (isRenderInstance(child)) return child.render(destination);
  if (child instanceof SlotString) {
    destination.write(child);
    return;
  }
  if (isHTMLString(child)) {
    destination.write(child);
    return;
  }
  if (!child && child !== 0) return;
  if (Array.isArray(child)) return renderArray(destination, child);
  if (typeof child === "function") return renderChild(destination, child());
  if (ArrayBuffer.isView(child)) {
    destination.write(child);
    return;
  }
  if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    if (Symbol.asyncIterator in child) return renderAsyncIterable(destination, child);
    return renderIterable(destination, child);
  }
  destination.write(child);
}
function renderArray(destination, children) {
  for (let i5 = 0; i5 < children.length; i5++) {
    const result = renderChild(destination, children[i5]);
    if (isPromise(result)) {
      if (i5 + 1 >= children.length) return result;
      const remaining = children.length - i5 - 1;
      const flushers = new Array(remaining);
      for (let j5 = 0; j5 < remaining; j5++) flushers[j5] = createBufferedRenderer(destination, (bufferDestination) => {
        return renderChild(bufferDestination, children[i5 + 1 + j5]);
      });
      return result.then(() => {
        let k4 = 0;
        const iterate = () => {
          while (k4 < flushers.length) {
            const flushResult = flushers[k4++].flush();
            if (isPromise(flushResult)) return flushResult.then(iterate);
          }
        };
        return iterate();
      });
    }
  }
}
function renderIterable(destination, children) {
  const iterator = children[Symbol.iterator]();
  const iterate = () => {
    for (; ; ) {
      const { value, done } = iterator.next();
      if (done) break;
      const result = renderChild(destination, value);
      if (isPromise(result)) return result.then(iterate);
    }
  };
  return iterate();
}
async function renderAsyncIterable(destination, children) {
  for await (const value of children) await renderChild(destination, value);
}
function validateComponentProps(props, clientDirectives, displayName) {
  if (props != null) {
    for (const prop in props) if (prop.startsWith(CLIENT_DIRECTIVE_PREFIX) && clientDirectives.has(prop.slice(7))) console.warn(`You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`);
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, result.clientDirectives, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  registerIfPropagating(result, factory, instance);
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
async function renderStreaming(root, result, destination) {
  const stack = [root];
  const openTagCache = /* @__PURE__ */ new Map();
  const closeTagCache = /* @__PURE__ */ new Map();
  const closeTagFor = (type) => {
    let tag = closeTagCache.get(type);
    if (tag === void 0) {
      tag = new HTMLString(`</${type}>`);
      closeTagCache.set(type, tag);
    }
    return tag;
  };
  const streamingState = new StreamingRenderState();
  let firstAsyncRender = null;
  const bufferedTail = [];
  const flushBufferedStaticOutput = () => {
    if (streamingState.bufferedStaticOutput) {
      bufferedTail.push(streamingState.bufferedStaticOutput);
      streamingState.bufferedStaticOutput = "";
    }
  };
  const renderDynamic = (node2) => (d4) => {
    if (isVNode(node2)) return renderJSX(result, node2).then((out) => renderChild(d4, out));
    return renderChild(d4, node2);
  };
  const handleVNode = (vnode) => {
    const type = vnode.type;
    if (!type) throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
    if (type === Fragment) {
      stack.push(vnode.props?.children);
      return;
    }
    if (isAstroComponentFactory(type)) {
      const props = {};
      const slots = {};
      for (const [key, value] of Object.entries(vnode.props ?? {})) if (key === "children" || value && typeof value === "object" && value["$$slot"]) slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      else props[key] = value;
      const displayName = type.name || "Anonymous";
      if (containsServerDirective(props)) {
        const island = new ServerIslandComponent(result, props, slots, displayName);
        result._metadata.propagators.add(island);
        stack.push(island);
        return;
      }
      stack.push(createAstroComponentInstance(result, displayName, type, props, slots));
      return;
    }
    if (typeof type === "string" && type !== ClientOnlyPlaceholder$1) {
      const props = vnode.props;
      let hasAttrs = false;
      if (props) {
        for (const key in props) if (key !== "children") {
          hasAttrs = true;
          break;
        }
      }
      const children = props?.children;
      const isVoid = (children == null || children === "") && voidElementNames.test(type);
      if (!hasAttrs) {
        const key = isVoid ? `${type}/` : type;
        let openTag = openTagCache.get(key);
        if (openTag === void 0) {
          openTag = isVoid ? `<${type}/>` : `<${type}>`;
          openTagCache.set(key, openTag);
        }
        streamingState.appendStatic(openTag);
        if (!isVoid) stack.push(closeTagFor(type));
      } else {
        const attrs = spreadElementAttributes(props);
        if (isVoid) {
          streamingState.appendStatic(`<${type}${attrs}/>`);
          return;
        }
        streamingState.appendStatic(`<${type}${attrs}>`);
        stack.push(closeTagFor(type));
      }
      if (!isVoid && children != null && children !== "") {
        if (typeof children === "string" && type === "style") stack.push(markHTMLString(escapeStyleText(children)));
        else stack.push(children);
      }
      return;
    }
    if (typeof type === "function" && vnode.props?.["server:root"]) {
      stack.push(type(vnode.props ?? {}));
      return;
    }
    stack.push(renderJSX(result, vnode));
  };
  while (stack.length > 0) {
    const node2 = stack.pop();
    if (node2 == null || node2 === false) continue;
    if (node2 instanceof TemplateFrame) {
      const htmlParts = node2.templateResult.htmlParts;
      const expressions = node2.templateResult.expressions;
      let i5 = node2.cursor;
      while (i5 < htmlParts.length) {
        if (htmlParts[i5]) streamingState.appendStatic(htmlParts[i5]);
        if (i5 >= expressions.length) break;
        const expression = expressions[i5];
        i5++;
        if (expression == null || expression === false) continue;
        const expressionType = typeof expression;
        if (expressionType === "string") {
          streamingState.appendStatic(escapeHTML(expression));
          continue;
        }
        if (expressionType === "number" || expressionType === "bigint" || expressionType === "boolean") {
          streamingState.appendStatic(String(expression));
          continue;
        }
        if (expression instanceof HTMLString || isHTMLString(expression)) {
          if (!(expression instanceof SlotString)) {
            streamingState.appendStatic(expression.toString());
            continue;
          }
        }
        node2.storeCursor(i5);
        stack.push(node2);
        stack.push(isPromise(expression) ? node2.templateResult.catchExpressionError(i5 - 1, expression) : expression);
        break;
      }
      continue;
    }
    const nodeType = typeof node2;
    if (nodeType === "string") {
      streamingState.appendStatic(escapeHTML(node2));
      continue;
    }
    if (nodeType === "number" || nodeType === "bigint" || nodeType === "boolean") {
      streamingState.appendStatic(String(node2));
      continue;
    }
    if (node2 instanceof HTMLString || isHTMLString(node2)) {
      if (!(node2 instanceof SlotString)) {
        streamingState.appendStatic(node2.toString());
        continue;
      }
    }
    if (Array.isArray(node2)) {
      for (let i5 = node2.length - 1; i5 >= 0; i5--) stack.push(node2[i5]);
      continue;
    }
    if (isRenderTemplateResult(node2)) {
      stack.push(new TemplateFrame(node2));
      continue;
    }
    if (isVNode(node2)) {
      handleVNode(node2);
      continue;
    }
    if (node2 instanceof SlotRenderInstance) {
      stack.push(node2.evaluate());
      continue;
    }
    if (isAstroComponentInstance(node2)) {
      const returnValue = node2.init(result);
      if (!isPromise(returnValue)) {
        stack.push(isHeadAndContent(returnValue) ? returnValue.content : returnValue);
        continue;
      }
    }
    if (!streamingState.isBuffering) {
      if (streamingState.pendingStaticOutput) {
        destination.write(streamingState.pendingStaticOutput);
        streamingState.pendingStaticOutput = "";
      }
      const rendered = renderDynamic(node2)(destination);
      if (isPromise(rendered)) {
        streamingState.isBuffering = true;
        firstAsyncRender = rendered;
      }
    } else {
      flushBufferedStaticOutput();
      bufferedTail.push(createBufferedRenderer(destination, renderDynamic(node2)));
    }
  }
  if (!streamingState.isBuffering) {
    if (streamingState.pendingStaticOutput) destination.write(streamingState.pendingStaticOutput);
    return;
  }
  await firstAsyncRender;
  flushBufferedStaticOutput();
  for (const segment of bufferedTail) if (typeof segment === "string") destination.write(segment);
  else {
    const flushResult = segment.flush();
    if (isPromise(flushResult)) await flushResult;
  }
}
async function renderStreamToString(result, templateResult, isPage) {
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) await bufferHeadContent(result);
  await renderStreaming(templateResult, result, { write(chunk) {
    if (isPage && !renderedFirstPageChunk) {
      renderedFirstPageChunk = true;
      if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
        const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
        str += doctype;
      }
    }
    if (chunk instanceof Response) return;
    str += chunkToString(result, chunk);
  } });
  return str;
}
async function renderStreamToStream(result, templateResult, isPage, route) {
  let renderedFirstPageChunk = false;
  if (isPage) await bufferHeadContent(result);
  return new ReadableStream({
    start(controller) {
      const destination = { write(chunk) {
        if (isPage && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            controller.enqueue(encoder.encode(doctype));
          }
        }
        if (chunk instanceof Response) throw new AstroError({ ...ResponseSentError });
        const bytes = chunkToByteArray(result, chunk);
        controller.enqueue(bytes);
      } };
      (async () => {
        try {
          await renderStreaming(templateResult, result, destination);
          controller.close();
        } catch (e4) {
          if (AstroError.is(e4) && !e4.loc) e4.setLocation({ file: route?.component });
          setTimeout(() => controller.error(e4), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function renderStreamToAsyncIterable(result, templateResult, isPage, _route) {
  let renderedFirstPageChunk = false;
  let error3 = null;
  let next = null;
  const buffer2 = [];
  let hasBytes = false;
  let lastIsString = false;
  let renderingComplete = false;
  if (isPage) await bufferHeadContent(result);
  const iterator = {
    async next() {
      if (result.cancelled) return {
        done: true,
        value: void 0
      };
      if (next !== null) await next.promise;
      else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) next = promiseWithResolvers();
      if (error3) throw error3;
      let mergedArray;
      if (!hasBytes) {
        let text = "";
        for (let i5 = 0, len = buffer2.length; i5 < len; i5++) text += buffer2[i5];
        mergedArray = encoder.encode(text);
      } else {
        let length = 0;
        let stringToEncode = "";
        for (let i5 = 0, len = buffer2.length; i5 < len; i5++) {
          const bufferEntry = buffer2[i5];
          if (typeof bufferEntry === "string") {
            const nextIsString = i5 + 1 < len && typeof buffer2[i5 + 1] === "string";
            stringToEncode += bufferEntry;
            if (!nextIsString) {
              const encoded = encoder.encode(stringToEncode);
              length += encoded.length;
              stringToEncode = "";
              buffer2[i5] = encoded;
            } else buffer2[i5] = "";
          } else length += bufferEntry.length;
        }
        mergedArray = new Uint8Array(length);
        let offset = 0;
        for (let i5 = 0, len = buffer2.length; i5 < len; i5++) {
          const item = buffer2[i5];
          if (item === "") continue;
          mergedArray.set(item, offset);
          offset += item.length;
        }
      }
      buffer2.length = 0;
      hasBytes = false;
      lastIsString = false;
      return {
        done: mergedArray.length === 0 && renderingComplete,
        value: mergedArray
      };
    },
    async return() {
      result.cancelled = true;
      return {
        done: true,
        value: void 0
      };
    }
  };
  const destination = { write(chunk) {
    if (isPage && !renderedFirstPageChunk) {
      renderedFirstPageChunk = true;
      if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
        const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
        buffer2.push(doctype);
        lastIsString = true;
      }
    }
    if (chunk instanceof Response) throw new AstroError(ResponseSentError);
    const bytes = chunkToByteArrayOrString(result, chunk);
    if (bytes.length > 0) {
      if (typeof bytes === "string") {
        if (lastIsString) buffer2[buffer2.length - 1] = buffer2[buffer2.length - 1] + bytes;
        else {
          buffer2.push(bytes);
          lastIsString = true;
        }
      } else {
        buffer2.push(bytes);
        hasBytes = true;
        lastIsString = false;
      }
      next?.resolve();
    } else if (buffer2.length > 0) next?.resolve();
  } };
  toPromise(() => renderStreaming(templateResult, result, destination)).catch((err) => {
    error3 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return { [Symbol.asyncIterator]() {
    return iterator;
  } };
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
  if (templateResult instanceof Response) return templateResult;
  return await renderStreamToString(result, templateResult, isPage);
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
  if (templateResult instanceof Response) return templateResult;
  return await renderStreamToStream(result, templateResult, isPage, route);
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) return factoryResult;
  else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: { file: route?.component }
    });
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) throw new AstroError({
    ...OnlyResponseCanBeReturned,
    message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
    location: { file: route?.component }
  });
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
  if (templateResult instanceof Response) return templateResult;
  return await renderStreamToAsyncIterable(result, templateResult, isPage, route);
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    if (INVALID_ATTR_NAME_CHAR.test(attr)) continue;
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(`<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`);
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  return constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
}
function guessRenderers(componentUrl) {
  switch (componentUrl?.split(".").pop()) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue (jsx)"
      ];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) throw new Error(`Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`);
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(_props, clientDirectives);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r5) => r5.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error3;
      for (const r5 of renderers2) try {
        if (await r5.ssr.check.call({ result }, Component, props, children, metadata)) {
          renderer = r5;
          break;
        }
      } catch (e4) {
        error3 ??= e4;
      }
      if (!renderer && error3) throw error3;
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(result, Component, _props, slots);
      return { render(destination) {
        destination.write(output);
      } };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) renderer = renderers2.find(({ name }) => name === `@astrojs/${rendererName}` || name === rendererName);
    }
    if (!renderer && validRenderers.length === 1) renderer = validRenderers[0];
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") renderer = renderers2.find(({ name }) => name === rendererName);
    }
  }
  let componentServerRenderEndTime;
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(metadata.displayName, metadata?.componentUrl?.split(".").pop(), plural, validRenderers.length),
          hint: NoMatchingRenderer.hint(formatList(probableRendererNames.map((r5) => "`" + r5 + "`")))
        });
      } else throw new AstroError({
        ...NoClientOnlyHint,
        message: NoClientOnlyHint.message(metadata.displayName),
        hint: NoClientOnlyHint.hint(probableRendererNames.map((r5) => r5.replace("@astrojs/", "")).join("|"))
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter((r5) => probableRendererNames.includes(r5.name));
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) throw new AstroError({
        ...NoMatchingRenderer,
        message: NoMatchingRenderer.message(metadata.displayName, metadata?.componentUrl?.split(".").pop(), plural, validRenderers.length),
        hint: NoMatchingRenderer.hint(formatList(probableRendererNames.map((r5) => "`" + r5 + "`")))
      });
      else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call({ result }, Component, propsWithoutTransitionAttributes, children, metadata));
      } else throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
    }
  } else if (metadata.hydrate === "only") html = await renderSlotToString(result, slots?.fallback);
  else {
    const componentRenderStartTime = performance.now();
    ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call({ result }, Component, propsWithoutTransitionAttributes, children, metadata));
    if (process.env.NODE_ENV === "development") componentServerRenderEndTime = performance.now() - componentRenderStartTime;
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(props, true, Tag)}${markHTMLString(childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`)}`;
    html = "";
    await renderTemplateResult.render({ write(chunk) {
      if (chunk instanceof Response) return;
      html += chunkToString(result, chunk);
    } });
  }
  if (!hydration) return { render(destination) {
    if (slotInstructions) for (const instruction of slotInstructions) destination.write(instruction);
    if (isPage || renderer?.name === "astro:jsx") destination.write(html);
    else if (html && html.length > 0) {
      const output = renderer ? removeStaticAstroSlot(html, renderer.ssr?.supportsAstroStaticSlot) : html;
      destination.write(markHTMLString(output));
    }
  } };
  const astroId = shorthash(`<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(props, metadata)}`);
  const island = await generateHydrateScript({
    renderer,
    result,
    astroId,
    props,
    attrs
  }, metadata);
  if (componentServerRenderEndTime && process.env.NODE_ENV === "development") island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) for (const key of Object.keys(children)) {
      let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
      let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
      if (!html.includes(expectedHTML)) unrenderedSlots.push(key);
    }
  } else unrenderedSlots = Object.keys(children);
  const template2 = unrenderedSlots.length > 0 ? unrenderedSlots.map((key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`).join("") : "";
  island.children = `${html ?? ""}${template2}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return { render(destination) {
    if (slotInstructions) for (const instruction of slotInstructions) destination.write(instruction);
    destination.write(createRenderInstruction({
      type: "directive",
      hydration
    }));
    if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) destination.write(createRenderInstruction({
      type: "renderer-hydration-script",
      rendererName: renderer.name,
      render: renderer.ssr.renderHydrationScript
    }));
    const renderedElement = renderElement$1("astro-island", island, false);
    destination.write(markHTMLString(renderedElement));
  } };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  const preRendered = slot?.(result);
  return { render(destination) {
    if (preRendered == null) return;
    return renderChild(destination, preRendered);
  } };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return { render(destination) {
    destination.write(markHTMLString(hydrationHtml + html));
  } };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  return createAstroComponentInstance(result, displayName, Component, props, slots);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isAstroComponentFactory(Component)) return renderAstroComponent(result, displayName, Component, normalizeProps(props), slots);
  if (isPromise(Component)) return Component.catch(handleCancellation).then((x4) => {
    return renderComponent(result, displayName, x4, props, slots);
  });
  if (isFragmentComponent(Component)) return renderFragmentComponent(result, slots);
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(handleCancellation);
  function handleCancellation(e4) {
    if (result.cancelled) return { render() {
    } };
    throw e4;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") delete props["class"];
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) head += chunkToString(result, maybeRenderHead());
  try {
    const destination = { write(chunk) {
      if (isPage && !result.partial && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!/<!doctype html/i.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype + head;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    } };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) await bufferPropagatedHead(result, { awaitPendingSlots: false });
    await renderInstance.render(destination);
  } catch (e4) {
    if (AstroError.is(e4) && !e4.loc) e4.setLocation({ file: route?.component });
    throw e4;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") return "";
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v4) => renderJSX(result, v4)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) if (item instanceof SlotString) {
        content += item;
        instructions = mergeSlotInstructions(instructions, item);
      } else content += item;
      if (instructions) return markHTMLString(new SlotString(content, instructions));
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type:
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) if (key === "children" || value && typeof value === "object" && value["$$slot"]) slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
        else props[key] = value;
        return markHTMLString(await renderComponentToString(result, vnode.type.name, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder && !vnode.type.includes("-")):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) return child.map((c4) => extractSlots2(c4));
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props && !isCustomElement2) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) return await renderJSX(result, await vnode.type(vnode.props ?? {}));
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.["astro:jsx"] || !output2) return await renderJSXVNode(result, output2);
          else return;
        } else vnode.props[hasTriedRenderComponentSymbol] = true;
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = { default: [] };
      const isCustomElement2 = typeof vnode.type === "string" && vnode.type.includes("-");
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) if (value?.["$$slot"]) {
        _slots[key] = value;
        delete props[key];
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) slotPromises.push(renderJSX(result, value).then((output2) => {
        if (output2.toString().trim().length === 0) return;
        slots[key] = () => output2;
      }));
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) output = await renderComponentToString(result, vnode.props["client:display-name"] ?? "", null, props, slots);
      else output = await renderComponentToString(result, typeof vnode.type === "function" ? vnode.type.name : vnode.type, vnode.type, props, slots);
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(`<${tag}${spreadAttributes(props)}${markHTMLString((children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`)}`);
}
function prerenderElementChildren(tag, children) {
  if (typeof children === "string" && tag === "style") return markHTMLString(escapeStyleText(children));
  return children;
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    const nonAstroMeta = result.componentMetadata.get(componentFactory.moduleId);
    result._metadata.headInTree = nonAstroMeta?.containsHead ?? false;
    result._metadata.routeHasPropagation = isPropagatingHint(nonAstroMeta?.propagation ?? "none");
    const pageProps = {
      ...props ?? {},
      "server:root": true
    };
    const str = await renderComponentToString(result, componentFactory.name, componentFactory, pageProps, {}, true, route);
    const bytes = encoder.encode(str);
    const headers2 = new Headers([["Content-Type", "text/html"], ["Content-Length", bytes.byteLength.toString()]]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) headers2.set("content-security-policy", renderCspContent(result));
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  const pageMeta = result.componentMetadata.get(componentFactory.moduleId);
  result._metadata.headInTree = pageMeta?.containsHead ?? false;
  result._metadata.routeHasPropagation = isPropagatingHint(pageMeta?.propagation ?? "none");
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(result, componentFactory, props, children, true, route);
      if (isWorkerd && !(nodeBody instanceof Response)) body = ReadableStream.from(nodeBody);
      else body = nodeBody;
    } else body = await renderToReadableStream(result, componentFactory, props, children, true, route);
  } else body = await renderToString(result, componentFactory, props, children, true, route);
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") headers.set("content-security-policy", renderCspContent(result));
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route && isRoute404(route.route)) {
    status = 404;
    if (statusText === "OK") statusText = "Not Found";
  } else if (route?.route && isRoute500(route.route)) {
    status = 500;
    if (statusText === "OK") statusText = "Internal Server Error";
  }
  if (status) return new Response(body, {
    ...init,
    headers,
    status,
    statusText
  });
  else return new Response(body, {
    ...init,
    headers
  });
}
function templateEnter(_result) {
  return TEMPLATE_ENTER;
}
function templateExit(_result) {
  return TEMPLATE_EXIT;
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") values.class += ` ${scopedClassName}`;
    else if (typeof values["class:list"] !== "undefined") values["class:list"] = [values["class:list"], scopedClassName];
    else values.class = scopedClassName;
  }
  for (const key of Object.keys(values)) output += addAttribute(values[key], key, true, _name);
  return markHTMLString(output);
}
var __create, __defProp2, __getOwnPropDesc, __getOwnPropNames2, __getProtoOf, __hasOwnProp, __commonJSMin, __exportAll, __copyProps, __toESM, alphabetUpperCase, decodeMap, EncodingPadding$1, DecodingPadding$1, base64Alphabet, EncodingPadding, DecodingPadding, base64DecodeMap, Cached, captureStackTrace, allowsEval, propertyKeyTypes, NUMBER_FORMAT_RANGES, BIGINT_FORMAT_RANGES, highSurrogate, installing, broke, breaker, CONSTANT_CATCH, _a$1, _zodDesc, _E, $ZodAsyncError, $ZodEncodeError, globalConfig, _messageDesc, _issuesDesc, _installedToString, initializer$1, $ZodError, _parse, _parseAsync, _safeParse, _safeParseAsync, COMPILE_INVALID, COMPILE_FALLBACK, validate, validateAsync$1, _encode, _decode, _encodeAsync, _decodeAsync, _safeEncode, _safeDecode, _safeEncodeAsync, _safeDecodeAsync, cuid, cuid2, ulid, xid, ksuid, nanoid, duration, guid, uuid, email, _emoji$1, ipv4, ipv6, cidrv4, cidrv6, base64, base64url, httpProtocol, e164, dateSource, date, anyString, lowercase, uppercase, $ZodCheck, _whenHasLength, $ZodCheckMaxLength, $ZodCheckMinLength, $ZodCheckLengthEquals, $ZodCheckStringFormat, $ZodCheckRegex, $ZodCheckLowerCase, $ZodCheckUpperCase, $ZodCheckIncludes, $ZodCheckStartsWith, $ZodCheckEndsWith, $ZodCheckOverwrite, Doc, version, $ZodType, toStandardResult, $ZodString, $ZodStringFormat, $ZodGUID, $ZodUUID, $ZodEmail, asciiTabOrNewline, $ZodURL, $ZodEmoji, $ZodNanoID, $ZodCUID, $ZodCUID2, $ZodULID, $ZodXID, $ZodKSUID, $ZodISODateTime, $ZodISODate, $ZodISOTime, $ZodISODuration, $ZodIPv4, ipv6Alphabet, $ZodIPv6, $ZodCIDRv4, $ZodCIDRv6, base64Charset, $ZodBase64, base64urlCharset, $ZodBase64URL, $ZodE164, $ZodJWT, $ZodUnknown, $ZodNever, $ZodArray, NO_SYMBOL_KEYS, $ZodObject, $ZodObjectJIT, $ZodUnion, $ZodIntersection, $ZodEnum, $ZodTransform, $ZodOptional, $ZodExactOptional, $ZodNullable, $ZodDefault, $ZodPrefault, $ZodNonOptional, $ZodCatch, $ZodPipe, $ZodReadonly, $ZodCustom, $ZodCyclicError, STATE, NO_ISSUES, recursive, NONE, ASSUMED, PROVEN, handoff, open, memo, error, _a, $ZodRegistry, globalRegistry, FOLDABLE_KEYS, UNION_KEYS, createToJSONSchemaMethod, createStandardJSONSchemaMethod, narrowMin, narrowMax, narrowBoth, addDivisor, addPattern, intersectMime, setFormat, minContributor, maxContributor, formatContributor, contributors, formatMap, exactPatterns, exactPattern, stringProcessor, neverProcessor, enumProcessor, customProcessor, transformProcessor, arrayProcessor, objectProcessor, unionProcessor, intersectionProcessor, nullableProcessor, nonoptionalProcessor, UNREPRESENTABLE_DEFAULT, defaultProcessor, prefaultProcessor, catchProcessor, pipeProcessor, readonlyProcessor, optionalProcessor, _installedErrorProtos, initializer, ZodRealError, parse, parseAsync, safeParse, safeParseAsync, encode, decode, encodeAsync, decodeAsync, safeEncode, safeDecode, safeEncodeAsync, safeDecodeAsync, ZodType, _ZodString, ZodString, ZodStringFormat, ZodISODateTime, ZodISODate, ZodISOTime, ZodISODuration, ZodEmail, ZodGUID, ZodUUID, ZodURL, ZodEmoji, ZodNanoID, ZodCUID, ZodCUID2, ZodULID, ZodXID, ZodKSUID, ZodIPv4, ZodIPv6, ZodCIDRv4, ZodCIDRv6, ZodBase64, ZodBase64URL, ZodE164, ZodJWT, ZodUnknown, ZodNever, ZodArray, ZodObject, ZodUnion, ZodIntersection, ZodEnum, ZodTransform, ZodOptional, ZodExactOptional, ZodNullable, ZodDefault, ZodPrefault, ZodNonOptional, ZodCatch, ZodPipe, ZodReadonly, ZodCustom, ZodIssueCode, ZodFirstPartyTypeKind, ALGORITHMS, ALGORITHM_VALUES, cspHashSchema, cspKindSchema, ATTRIBUTE_ALLOWED_RESOURCES, ALLOWED_DIRECTIVES, ALGORITHM, encoder$1, decoder$1, IV_LENGTH, ASTRO_GENERATOR, ASTRO_ERROR_HEADER, DEFAULT_404_COMPONENT, REDIRECT_STATUS_CODES, REROUTABLE_STATUS_CODES, clientAddressSymbol, originPathnameSymbol, fetchStateSymbol, responseSentSymbol, e, t, n, r$1, i, a, o, s, ROUTE404_RE, ROUTE500_RE, ESCAPABLE, HTMLBytes, htmlStringSymbol, HTMLString, markHTMLString, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, astro_island_prebuilt_dev_default, ISLAND_STYLES, RenderInstructionSymbol, voidElementNames, htmlBooleanAttributes, AMPERSAND_REGEX, DOUBLE_QUOTE_REGEX, STATIC_DIRECTIVES, INVALID_ATTR_NAME_CHAR, toIdent, toAttributeString, kebab, toStyleString, ATTRIBUTE_KIND, noop, BufferedRenderer, isNode, isDeno, isWorkerd, HEAD_INSTRUCTION, MAYBE_HEAD_INSTRUCTION, SERVER_ISLAND_START, renderTemplateResultSym, markedHtmlParts, RenderTemplateResult, slotString, SlotString, SlotRenderInstance, internalProps, ServerIslandComponent, renderServerIslandRuntime, SERVER_ISLAND_REPLACER, Fragment, Renderer, encoder, decoder, astroComponentInstanceSym, CLIENT_DIRECTIVE_PREFIX, AstroComponentInstance, ClientOnlyPlaceholder$1, TemplateFrame, StreamingRenderState, DOCTYPE_EXP, needsHeadRenderingSymbol, rendererAliases, clientOnlyValues, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder, hasTriedRenderComponentSymbol, TEMPLATE_ENTER, TEMPLATE_EXIT;
var init_server_CW5TLezH = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/server_CW5TLezH.mjs"() {
    "use strict";
    init_errors_D7mtj974();
    __create = Object.create;
    __defProp2 = Object.defineProperty;
    __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    __getOwnPropNames2 = Object.getOwnPropertyNames;
    __getProtoOf = Object.getPrototypeOf;
    __hasOwnProp = Object.prototype.hasOwnProperty;
    __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
    __exportAll = (all, no_symbols) => {
      let target = {};
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
      if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
      return target;
    };
    __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i5 = 0, n3 = keys.length, key; i5 < n3; i5++) {
        key = keys[i5];
        if (!__hasOwnProp.call(to, key) && key !== except) __defProp2(to, key, {
          get: ((k4) => from[k4]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
      }
      return to;
    };
    __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp2(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod));
    alphabetUpperCase = "0123456789ABCDEF";
    decodeMap = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding$1 || (EncodingPadding$1 = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding$1 || (DecodingPadding$1 = {}));
    base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding || (EncodingPadding = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding || (DecodingPadding = {}));
    base64DecodeMap = {
      "0": 52,
      "1": 53,
      "2": 54,
      "3": 55,
      "4": 56,
      "5": 57,
      "6": 58,
      "7": 59,
      "8": 60,
      "9": 61,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      "+": 62,
      "/": 63
    };
    Cached = class {
      constructor(getter) {
        this._getter = getter;
        this._value = void 0;
      }
      get value() {
        const getter = this._getter;
        if (getter !== void 0) {
          this._value = getter();
          this._getter = void 0;
        }
        return this._value;
      }
    };
    captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
    };
    allowsEval = /* @__PURE__ */ cached(() => {
      if (globalConfig.jitless) return false;
      if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
      try {
        new Function("");
        return true;
      } catch (_4) {
        return false;
      }
    });
    propertyKeyTypes = /* @__PURE__ */ new Set([
      "string",
      "number",
      "symbol"
    ]);
    NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
      safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      int32: [-2147483648, 2147483647],
      uint32: [0, 4294967295],
      float32: [-34028234663852886e22, 34028234663852886e22],
      float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
    }))();
    BIGINT_FORMAT_RANGES = {
      int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
      uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
    };
    highSurrogate = /[\uD800-\uDBFF]/;
    broke = false;
    breaker = {
      configurable: true,
      get() {
        broke = true;
      }
    };
    CONSTANT_CATCH = "~constantCatch";
    _zodDesc = {
      value: void 0,
      enumerable: false
    };
    _E = "captureStackTrace" in Error ? Error : null;
    $ZodAsyncError = class extends Error {
      constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
    };
    $ZodEncodeError = class extends Error {
      constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
      }
    };
    (_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
    globalConfig = globalThis.__zod_globalConfig;
    _messageDesc = {
      get: _getMessage,
      set: _setMessage,
      enumerable: true,
      configurable: true
    };
    _issuesDesc = {
      value: void 0,
      enumerable: false
    };
    _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
    initializer$1 = (inst, def) => {
      inst.name = "$ZodError";
      _issuesDesc.value = def;
      Object.defineProperty(inst, "issues", _issuesDesc);
      _issuesDesc.value = void 0;
      Object.defineProperty(inst, "message", _messageDesc);
      const proto = Object.getPrototypeOf(inst);
      if (!_installedToString.has(proto)) {
        _installedToString.add(proto);
        Object.defineProperty(proto, "toString", {
          configurable: true,
          enumerable: false,
          get() {
            const value = () => this.message;
            Object.defineProperty(this, "toString", {
              value,
              configurable: true,
              writable: true
            });
            return value;
          },
          set(value) {
            Object.defineProperty(this, "toString", {
              value,
              configurable: true,
              writable: true
            });
          }
        });
      }
    };
    $ZodError = $constructor("$ZodError", initializer$1);
    $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
    _parse = (_Err) => {
      const fn = (schema, value, _ctx, _params) => {
        const ctx = _ctx ? {
          ..._ctx,
          async: false
        } : { async: false };
        const result = schema._zod.run({
          value,
          issues: []
        }, ctx);
        if (result instanceof Promise) throw new $ZodAsyncError();
        if (result.issues.length) {
          const e4 = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
          captureStackTrace(e4, _params?.callee ?? fn);
          throw e4;
        }
        return result.value;
      };
      return fn;
    };
    _parseAsync = (_Err) => {
      const fn = async (schema, value, _ctx, params) => {
        const ctx = _ctx ? {
          ..._ctx,
          async: true
        } : { async: true };
        let result = schema._zod.run({
          value,
          issues: []
        }, ctx);
        if (result instanceof Promise) result = await result;
        if (result.issues.length) {
          const e4 = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
          captureStackTrace(e4, params?.callee ?? fn);
          throw e4;
        }
        return result.value;
      };
      return fn;
    };
    _safeParse = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? {
        ..._ctx,
        async: false
      } : { async: false };
      const result = schema._zod.run({
        value,
        issues: []
      }, ctx);
      if (result instanceof Promise) throw new $ZodAsyncError();
      return result.issues.length ? failure(_Err, result.issues, ctx) : {
        success: true,
        data: result.value
      };
    };
    _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? {
        ..._ctx,
        async: true
      } : { async: true };
      let result = schema._zod.run({
        value,
        issues: []
      }, ctx);
      if (result instanceof Promise) result = await result;
      return result.issues.length ? failure(_Err, result.issues, ctx) : {
        success: true,
        data: result.value
      };
    };
    COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
    COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
    validate = ((schema, value, _ctx) => {
      const validator = schema._zod.bag.validator;
      if (validator !== void 0) {
        if (validator(value) !== COMPILE_INVALID) return true;
        if (validator.definite === true && _ctx === void 0) return false;
      }
      return validateFallback(schema, value, _ctx);
    });
    validateAsync$1 = async (schema, value, _ctx) => {
      const ctx = _ctx ? {
        ..._ctx,
        async: true,
        abortEarly: true
      } : {
        async: true,
        abortEarly: true
      };
      let result = schema._zod.run({
        value,
        issues: []
      }, ctx);
      if (result instanceof Promise) result = await result;
      return result.issues.length === 0;
    };
    _encode = (_Err) => {
      const parse3 = _parse(_Err);
      const fn = (schema, value, _ctx, _params) => {
        const ctx = _ctx ? {
          ..._ctx,
          direction: "backward"
        } : { direction: "backward" };
        return parse3(schema, value, ctx, finalizeParams(fn, _params));
      };
      return fn;
    };
    _decode = (_Err) => {
      const parse3 = _parse(_Err);
      const fn = (schema, value, _ctx, _params) => {
        return parse3(schema, value, _ctx, finalizeParams(fn, _params));
      };
      return fn;
    };
    _encodeAsync = (_Err) => {
      const parseAsync2 = _parseAsync(_Err);
      const fn = async (schema, value, _ctx, _params) => {
        const ctx = _ctx ? {
          ..._ctx,
          direction: "backward"
        } : { direction: "backward" };
        return await parseAsync2(schema, value, ctx, finalizeParams(fn, _params));
      };
      return fn;
    };
    _decodeAsync = (_Err) => {
      const parseAsync2 = _parseAsync(_Err);
      const fn = async (schema, value, _ctx, _params) => {
        return await parseAsync2(schema, value, _ctx, finalizeParams(fn, _params));
      };
      return fn;
    };
    _safeEncode = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? {
        ..._ctx,
        direction: "backward"
      } : { direction: "backward" };
      return _safeParse(_Err)(schema, value, ctx);
    };
    _safeDecode = (_Err) => (schema, value, _ctx) => {
      return _safeParse(_Err)(schema, value, _ctx);
    };
    _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? {
        ..._ctx,
        direction: "backward"
      } : { direction: "backward" };
      return _safeParseAsync(_Err)(schema, value, ctx);
    };
    _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
      return _safeParseAsync(_Err)(schema, value, _ctx);
    };
    cuid = /^[cC][0-9a-z]{6,}$/;
    cuid2 = /^[0-9a-z]+$/;
    ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
    xid = /^[0-9a-vA-V]{20}$/;
    ksuid = /^[A-Za-z0-9]{27}$/;
    nanoid = /^[a-zA-Z0-9_-]{21}$/;
    duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
    guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    uuid = (version2) => {
      if (!version2) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
      return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
    };
    email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    _emoji$1 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
    ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
    cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
    base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
    httpProtocol = /^https?$/;
    e164 = /^\+[1-9]\d{6,14}$/;
    dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
    date = /* @__PURE__ */ anchor(dateSource);
    anyString = /^[\s\S]{0,}$/;
    lowercase = /^[^A-Z]*$/;
    uppercase = /^[^a-z]*$/;
    $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
      var _a2;
      inst._zod ?? (inst._zod = {});
      inst._zod.def = def;
      (_a2 = inst._zod).onattach ?? (_a2.onattach = []);
    });
    _whenHasLength = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    };
    $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a2;
      $ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = _whenHasLength);
      inst._zod.check = (payload) => {
        const input = payload.value;
        const units2 = input.length;
        if ((typeof input === "string" && units2 > def.maximum ? codePointLength(input) : units2) <= def.maximum) return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
      var _a2;
      $ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = _whenHasLength);
      inst._zod.check = (payload) => {
        const input = payload.value;
        const units2 = input.length;
        if ((typeof input === "string" && units2 >= def.minimum && units2 < def.minimum * 2 ? codePointLength(input) : units2) >= def.minimum) return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a2;
      $ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = _whenHasLength);
      inst._zod.check = (payload) => {
        const input = payload.value;
        const units2 = input.length;
        const length = typeof input === "string" && units2 >= def.length && units2 <= def.length * 2 ? codePointLength(input) : units2;
        if (length === def.length) return;
        const origin = getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
          origin,
          ...tooBig ? {
            code: "too_big",
            maximum: def.length
          } : {
            code: "too_small",
            minimum: def.length
          },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
      var _a2, _b;
      $ZodCheck.init(inst, def);
      if (def.pattern) (_a2 = inst._zod).check ?? (_a2.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value)) return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          ...def.pattern ? { pattern: def.pattern.toString() } : {},
          inst,
          continue: !def.abort
        });
      });
      else (_b = inst._zod).check ?? (_b.check = () => {
      });
    });
    $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
      $ZodCheckStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value)) return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "regex",
          input: payload.value,
          pattern: def.pattern.toString(),
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
      def.pattern ?? (def.pattern = lowercase);
      $ZodCheckStringFormat.init(inst, def);
    });
    $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
      def.pattern ?? (def.pattern = uppercase);
      $ZodCheckStringFormat.init(inst, def);
    });
    $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
      $ZodCheck.init(inst, def);
      const escapedRegex = escapeRegex(def.includes);
      def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
      inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position)) return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "includes",
          includes: def.includes,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix)) return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "starts_with",
          prefix: def.prefix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix)) return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "ends_with",
          suffix: def.suffix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
      $ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
      };
    });
    Doc = class {
      constructor(args = [], closed = {}) {
        this.content = [];
        this.indent = 0;
        this.args = args;
        this.closed = closed;
      }
      indented(fn) {
        this.indent += 1;
        try {
          fn(this);
        } finally {
          this.indent -= 1;
        }
      }
      write(arg) {
        if (typeof arg === "function") {
          arg(this, { execution: "sync" });
          arg(this, { execution: "async" });
          return;
        }
        const lines = arg.split("\n").filter((x4) => x4);
        const minIndent = Math.min(...lines.map((x4) => x4.length - x4.trimStart().length));
        const dedented = lines.map((x4) => x4.slice(minIndent)).map((x4) => " ".repeat(this.indent * 2) + x4);
        for (const line of dedented) this.content.push(line);
      }
      compile() {
        const F4 = Function;
        const content = this?.content ?? [``];
        return new F4(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join("\n")}
};`)(...Object.values(this.closed));
      }
    };
    version = {
      major: 4,
      minor: 6,
      patch: 5
    };
    $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
      var _a2;
      inst ?? (inst = {});
      inst._zod.def = def;
      inst._zod.bag = inst._zod.bag || {};
      inst._zod.version = version;
      const defChecks = inst._zod.def.checks;
      const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
      for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
      if (checks.length === 0) {
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        inst._zod.deferred?.push(() => {
          inst._zod.run = inst._zod.parse;
        });
      } else {
        const runChecks = (payload, checks2, ctx) => {
          if (payload.memo) return payload;
          let isAborted = aborted(payload);
          let asyncResult;
          for (const ch of checks2) {
            if (ch._zod.def.when) {
              if (explicitlyAborted(payload)) continue;
              if (!ch._zod.def.when(payload)) continue;
            } else if (isAborted) continue;
            const currLen = payload.issues.length;
            const _4 = ch._zod.check(payload);
            if (_4 instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
            if (asyncResult || _4 instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _4;
              if (payload.issues.length === currLen) return;
              attachSchema(payload.issues, currLen, inst);
              if (!isAborted) isAborted = aborted(payload, currLen);
            });
            else {
              if (payload.issues.length === currLen) continue;
              attachSchema(payload.issues, currLen, inst);
              if (!isAborted) isAborted = aborted(payload, currLen);
            }
          }
          if (asyncResult) return asyncResult.then(() => {
            return payload;
          });
          return payload;
        };
        const handleCanaryResult = (canary, payload, ctx) => {
          if (aborted(canary)) {
            canary.aborted = true;
            return canary;
          }
          const checkResult = runChecks(payload, checks, ctx);
          if (checkResult instanceof Promise) {
            if (ctx.async === false) throw new $ZodAsyncError();
            return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
          }
          return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
          if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
          if (ctx.direction === "backward") {
            const canary = inst._zod.parse({
              value: payload.value,
              issues: []
            }, {
              ...ctx,
              skipChecks: true
            });
            if (canary instanceof Promise) return canary.then((canary2) => {
              return handleCanaryResult(canary2, payload, ctx);
            });
            return handleCanaryResult(canary, payload, ctx);
          }
          const result = inst._zod.parse(payload, ctx);
          if (result instanceof Promise) {
            if (ctx.async === false) throw new $ZodAsyncError();
            return result.then((result2) => runChecks(result2, checks, ctx));
          }
          return runChecks(result, checks, ctx);
        };
      }
    }, {
      get "~standard"() {
        return hide(this, "~standard", standardProps(this));
      },
      set "~standard"(value) {
        own(this, "~standard", value);
      }
    });
    toStandardResult = (r5, ctx) => r5.issues.length ? { issues: r5.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r5.value };
    $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.pattern = def.pattern ?? anyString;
      inst._zod.parse = (payload, _4) => {
        if (def.coerce) try {
          payload.value = String(payload.value);
        } catch (_5) {
        }
        if (typeof payload.value === "string") return payload;
        payload.issues.push({
          expected: "string",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
      $ZodCheckStringFormat.init(inst, def);
      $ZodString.init(inst, def);
    });
    $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
      def.pattern ?? (def.pattern = guid);
      $ZodStringFormat.init(inst, def);
    });
    $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
      if (def.version) {
        const v4 = {
          v1: 1,
          v2: 2,
          v3: 3,
          v4: 4,
          v5: 5,
          v6: 6,
          v7: 7,
          v8: 8
        }[def.version];
        if (v4 === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid(v4));
      } else def.pattern ?? (def.pattern = uuid());
      $ZodStringFormat.init(inst, def);
    });
    $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
      def.pattern ?? (def.pattern = email);
      $ZodStringFormat.init(inst, def);
    });
    asciiTabOrNewline = /[\t\n\r]/g;
    $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        try {
          const trimmed = payload.value.trim();
          const url = validateURL(trimmed, def);
          if (url === 1) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid URL format",
              input: payload.value,
              inst,
              continue: !def.abort
            });
            return;
          }
          if (url === 2) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              input: payload.value,
              inst,
              continue: !def.abort
            });
            return;
          }
          if (url === true) {
            payload.value = stripTabAndNewline(trimmed);
            return;
          }
          if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
          if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
          payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
          return;
        } catch (_4) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
      def.pattern ?? (def.pattern = emoji());
      $ZodStringFormat.init(inst, def);
    });
    $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
      if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
      def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
      $ZodStringFormat.init(inst, def);
    });
    $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
      def.pattern ?? (def.pattern = cuid);
      $ZodStringFormat.init(inst, def);
    });
    $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
      def.pattern ?? (def.pattern = cuid2);
      $ZodStringFormat.init(inst, def);
    });
    $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
      def.pattern ?? (def.pattern = ulid);
      $ZodStringFormat.init(inst, def);
    });
    $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
      def.pattern ?? (def.pattern = xid);
      $ZodStringFormat.init(inst, def);
    });
    $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
      def.pattern ?? (def.pattern = ksuid);
      $ZodStringFormat.init(inst, def);
    });
    $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
      def.pattern ?? (def.pattern = datetime(def));
      $ZodStringFormat.init(inst, def);
    });
    $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
      def.pattern ?? (def.pattern = date);
      $ZodStringFormat.init(inst, def);
    });
    $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
      def.pattern ?? (def.pattern = time(def));
      $ZodStringFormat.init(inst, def);
    });
    $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
      def.pattern ?? (def.pattern = duration);
      $ZodStringFormat.init(inst, def);
    });
    $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
      def.pattern ?? (def.pattern = ipv4);
      $ZodStringFormat.init(inst, def);
    });
    ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
    $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
      def.pattern ?? (def.pattern = ipv6);
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (!isValidIPv6(payload.value)) payload.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv4);
      $ZodStringFormat.init(inst, def);
    });
    $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv6);
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (!isValidCIDRv6(payload.value)) payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
    $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
      def.pattern ?? (def.pattern = base64Charset);
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (isValidBase64(payload.value)) return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    base64urlCharset = /^[A-Za-z0-9_-]*$/;
    $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
      def.pattern ?? (def.pattern = base64urlCharset);
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (isValidBase64URL(payload.value)) return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
      def.pattern ?? (def.pattern = e164);
      $ZodStringFormat.init(inst, def);
    });
    $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (isValidJWT(payload.value, def.alg)) return;
        payload.issues.push({
          code: "invalid_format",
          format: "jwt",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
    });
    $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
          expected: "never",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
      $ZodType.init(inst, def);
      const memo2 = globalConfig.memoizer;
      memo2?.attach(inst);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            expected: "array",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = memo2 ? memo2.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
        const proms = [];
        const abortEarly = ctx?.abortEarly;
        for (let i5 = 0; i5 < input.length; i5++) {
          const item = input[i5];
          const result = def.element._zod.run({
            value: item,
            issues: []
          }, ctx);
          if (result instanceof Promise) proms.push(result.then((result2) => handleArrayResult(result2, payload, i5)));
          else {
            handleArrayResult(result, payload, i5);
            if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
          }
        }
        if (proms.length) return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    NO_SYMBOL_KEYS = [];
    $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
      $ZodType.init(inst, def);
      const desc = Object.getOwnPropertyDescriptor(def, "shape");
      const sh = desc?.get ? desc.get.raw : def.shape ?? {};
      if (sh) {
        const get = () => {
          const newSh = { ...sh };
          Object.defineProperty(def, "shape", { value: newSh });
          get.raw = newSh;
          return newSh;
        };
        get.raw = sh;
        Object.defineProperty(def, "shape", { get });
      }
      const _normalized = cached(() => normalizeDef(def));
      defineLazyInternal(inst, "propValues", (zod) => {
        const shape = zod.def.shape;
        const propValues = {};
        for (const key in shape) {
          const field = shape[key]._zod;
          if (field.values) {
            if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
            for (const v4 of field.values) propValues[key].add(v4);
            if (field.optin !== void 0) propValues[key].add(void 0);
          }
        }
        return propValues;
      });
      const isObject$2 = isObject;
      const catchall = def.catchall;
      let value;
      const memo2 = globalConfig.memoizer;
      memo2?.attach(inst);
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject$2(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
        const proms = [];
        const shape = value.shape;
        const abortEarly = ctx?.abortEarly;
        let seen = payload.issues.length;
        for (const key of value.allKeys) {
          if (abortEarly && payload.issues.length !== seen) {
            if (aborted(payload, seen)) break;
            seen = payload.issues.length;
          }
          if (key === "__proto__") continue;
          const el = shape[key];
          const optin = el._zod.optin;
          const optout = el._zod.optout;
          const r5 = el._zod.run({
            value: input[key],
            issues: []
          }, ctx);
          if (r5 instanceof Promise) proms.push(r5.then((r6) => handlePropertyResult(r6, payload, key, input, optin, optout)));
          else handlePropertyResult(r5, payload, key, input, optin, optout);
        }
        if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
        return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
      };
    });
    $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
      $ZodObject.init(inst, def);
      const superParse = inst._zod.parse;
      const _normalized = cached(() => normalizeDef(def));
      const memo2 = globalConfig.memoizer;
      const generateFastpass = (shape) => {
        const normalized = _normalized.value;
        const syms = normalized.symbolKeys;
        const doc = new Doc(["payload", "ctx"], {
          shape,
          inst,
          memo: memo2,
          syms
        });
        const parseStr = (k4) => `shape[${k4}]._zod.run({ value: input[${k4}], issues: [] }, ctx)`;
        const prefixStr = (id, k4) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k4}, ...iss.path] : [${k4}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
        doc.write(`const input = payload.value;`);
        const ids = /* @__PURE__ */ Object.create(null);
        let counter = 0;
        for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
        doc.write(memo2 ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
        for (const key of normalized.allKeys) {
          if (key === "__proto__") continue;
          const id = ids[key];
          const k4 = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
          const isPresent = `${k4} in input`;
          const schema = shape[key];
          const optin = schema?._zod?.optin;
          const isOptionalIn = optin !== void 0;
          const isOptionalOut = schema?._zod?.optout === "optional";
          doc.write(`const ${id} = ${parseStr(k4)};`);
          if (isOptionalIn && isOptionalOut) {
            const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
            doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k4)}
          }

          if (${assign}) {
            newResult[${k4}] = ${id}.value;
          }
        }

      `);
          } else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k4)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k4}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k4}] = ${id}.value;
        }

      `);
          else {
            doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k4)}
        }
      `);
            if (optin === "defaulted") doc.write(`newResult[${k4}] = ${id}.value;`);
            else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k4}] = ${id}.value;
        }
      `);
          }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        return doc.compile();
      };
      let fastpass;
      const isObject$1 = isObject;
      const jit = !globalConfig.jitless;
      const fastEnabled = jit && allowsEval.value;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject$1(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
          if (!fastpass) fastpass = generateFastpass(def.shape);
          payload = fastpass(payload, ctx);
          if (!catchall) return payload;
          return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
        }
        return superParse(payload, ctx);
      };
    });
    $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o5) => o5._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o5) => o5._zod.optin !== void 0) ? "optional" : void 0);
      defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o5) => o5._zod.optout === "optional") ? "optional" : void 0);
      defineLazyInternal(inst, "values", (zod) => {
        if (zod.def.options.every((o5) => o5._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
      });
      defineLazyInternal(inst, "pattern", (zod) => {
        if (zod.def.options.every((o5) => o5._zod.pattern)) {
          const patterns = zod.def.options.map((o5) => o5._zod.pattern);
          return new RegExp(`^(${patterns.map((p4) => cleanRegex(p4.source)).join("|")})$`);
        }
      });
      const first = def.options.length === 1 ? def.options[0]._zod.run : null;
      inst._zod.parse = (payload, ctx) => {
        if (first) return first(payload, ctx);
        let async = false;
        const results = [];
        for (const option of def.options) {
          const result = option._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            results.push(result);
            async = true;
          } else {
            if (result.issues.length === 0) return result;
            results.push(result);
          }
        }
        if (!async) return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results2) => {
          return handleUnionResults(results2, payload, inst, ctx);
        });
      };
    });
    $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({
          value: input,
          issues: []
        }, ctx);
        const right = def.right._zod.run({
          value: input,
          issues: []
        }, ctx);
        if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left2, right2]) => {
          return handleIntersectionResults(payload, left2, right2);
        });
        return handleIntersectionResults(payload, left, right);
      };
    });
    $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
      $ZodType.init(inst, def);
      const values = getEnumValues(def.entries);
      const valuesSet = new Set(values);
      inst._zod.values = valuesSet;
      defineLazyInternal(inst, "pattern", (zod) => {
        const patternValues = getEnumValues(zod.def.entries).filter((k4) => propertyKeyTypes.has(typeof k4));
        return new RegExp(patternValues.length ? `^(${patternValues.map((o5) => escapeRegex(o5.toString())).join("|")})$` : "^[^\\s\\S]$");
      });
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) return payload;
        payload.issues.push({
          code: "invalid_value",
          values,
          input,
          inst
        });
        return payload;
      };
    });
    $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      globalConfig.memoizer?.guard(inst);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
        const _out = def.transform(payload.value, payload);
        if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
          payload.value = output;
          return payload;
        });
        if (_out instanceof Promise) throw new $ZodAsyncError();
        payload.value = _out;
        return payload;
      };
    });
    $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
      inst._zod.optout = "optional";
      defineLazyInternal(inst, "values", (zod) => {
        const values = zod.def.innerType._zod.values;
        return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
      });
      defineLazyInternal(inst, "pattern", (zod) => {
        const pattern = zod.def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (payload.value === void 0) {
          if (def.innerType._zod.optin !== "defaulted") return payload;
          const result = def.innerType._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result instanceof Promise) return result.then((result2) => handleOptionalResult(payload, result2));
          return handleOptionalResult(payload, result);
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
      $ZodOptional.init(inst, def);
      defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
      defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
      inst._zod.parse = (payload, ctx) => {
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
      defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
      defineLazyInternal(inst, "pattern", (zod) => {
        const pattern = zod.def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
      });
      defineLazyInternal(inst, "values", (zod) => {
        return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (payload.value === null) return payload;
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "defaulted";
      defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
          return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) return result.then((result2) => handleDefaultResult(result2, def));
        return handleDefaultResult(result, def);
      };
    });
    $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "defaulted";
      defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        if (payload.value === void 0) payload.value = def.defaultValue;
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "values", (zod) => {
        const v4 = zod.def.innerType._zod.values;
        return v4 ? new Set([...v4].filter((x4) => x4 !== void 0)) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) return result.then((result2) => handleNonOptionalResult(result2, inst));
        return handleNonOptionalResult(result, inst);
      };
    });
    $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
      defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
      defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        const result = def.innerType._zod.run({
          value: payload.value,
          issues: []
        }, ctx);
        if (result instanceof Promise) return result.then((result2) => handleCatchResult(payload, result2, def, ctx));
        return handleCatchResult(payload, result, def, ctx);
      };
    });
    $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
      defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
      defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
      defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) return right.then((right2) => handlePipeResult(right2, def.in, ctx));
          return handlePipeResult(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) return left.then((left2) => handlePipeResult(left2, def.out, ctx));
        return handlePipeResult(left, def.out, ctx);
      };
    });
    $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
      defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
      defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
      defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) return result.then(handleReadonlyResult);
        return handleReadonlyResult(result);
      };
    });
    $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
      $ZodCheck.init(inst, def);
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _4) => {
        return payload;
      };
      inst._zod.check = (payload) => {
        const input = payload.value;
        const r5 = def.fn(input);
        if (r5 instanceof Promise) return r5.then((r6) => handleRefineResult(r6, payload, input, inst));
        handleRefineResult(r5, payload, input, inst);
      };
    });
    $ZodCyclicError = class extends Error {
      constructor() {
        super(`Cannot parse a reference cycle that closes through a transform`);
        this.name = "ZodCyclicError";
      }
    };
    STATE = "~memo";
    NO_ISSUES = [];
    recursive = /* @__PURE__ */ new WeakMap();
    NONE = 0;
    ASSUMED = 1;
    PROVEN = 2;
    open = [];
    memo = {
      alloc(_inst, payload, empty) {
        const bucket = handoff;
        if (!bucket) return empty;
        handoff = void 0;
        const entry = {
          value: empty,
          issues: null
        };
        bucket.set(payload.value, entry);
        open.push(entry);
        return empty;
      },
      guard(inst) {
        var _a2;
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        inst._zod.deferred.push(() => {
          const base = inst._zod.parse;
          const wrapped = (payload, ctx) => {
            if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
            return base(payload, ctx);
          };
          inst._zod.parse = wrapped;
          if (inst._zod.run === base) inst._zod.run = wrapped;
        });
      },
      attach(inst) {
        var _a2;
        let isRecursiveInst;
        let rechecked = false;
        let lastCtx;
        let lastBucket;
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        inst._zod.deferred.push(() => {
          const base = inst._zod.parse;
          const wrapped = (payload, ctx) => {
            if (isRecursiveInst === void 0) {
              const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
              if (walked === NONE) {
                inst._zod.parse = base;
                if (inst._zod.run === wrapped) inst._zod.run = base;
                return base(payload, ctx);
              }
              if (walked === PROVEN || rechecked) isRecursiveInst = true;
              else rechecked = true;
            }
            const input = payload.value;
            if (!isRef(input)) return base(payload, ctx);
            let state = ctx[STATE];
            if (!state) {
              state = {
                buckets: /* @__PURE__ */ new WeakMap(),
                backEdges: void 0
              };
              ctx[STATE] = state;
            }
            let bucket;
            if (lastCtx === ctx) bucket = lastBucket;
            else {
              bucket = bucketFor(state, inst);
              lastCtx = ctx;
              lastBucket = bucket;
            }
            const hit = bucket.get(input);
            if (hit) {
              payload.value = hit.value;
              if (hit.issues) {
                if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
              } else {
                payload.memo = true;
                state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
                state.backEdges.add(hit.value);
              }
              return payload;
            }
            handoff = bucket;
            const depth = open.length;
            const result = base(payload, ctx);
            handoff = void 0;
            const entry = open.length > depth ? open.pop() : void 0;
            if (result instanceof Promise) return result.then((r5) => {
              if (entry) entry.issues = r5.issues.length ? cloneIssues(r5.issues) : NO_ISSUES;
              return r5;
            });
            if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
            return result;
          };
          inst._zod.parse = wrapped;
          if (inst._zod.run === base) inst._zod.run = wrapped;
        });
      }
    };
    error = () => {
      const Sizable = {
        string: {
          unit: "characters",
          verb: "to have"
        },
        file: {
          unit: "bytes",
          verb: "to have"
        },
        array: {
          unit: "items",
          verb: "to have"
        },
        set: {
          unit: "items",
          verb: "to have"
        },
        map: {
          unit: "entries",
          verb: "to have"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        mac: "MAC address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        currency_code: "currency code",
        credit_card: "credit card number",
        iban: "IBAN",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = { nan: "NaN" };
      function getTypeName(type, input) {
        if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
        return TypeDictionary[type] ?? type;
      }
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Invalid input: expected ${getTypeName(issue2.expected)}, received ${getTypeName(parsedType(issue2.input), issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
            return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.exact ? "exactly " : issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.exact ? "exactly " : issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
            if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
            if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
            if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
            return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Invalid number: must be a multiple of ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Invalid key in ${issue2.origin}`;
          case "invalid_union":
            if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) return `Invalid discriminator value. Expected ${issue2.options.map((o5) => `'${o5}'`).join(" | ")}`;
            if (issue2.inclusive === false) return "Invalid input: more than one option matched";
            return "Invalid input";
          case "invalid_element":
            return `Invalid value in ${issue2.origin}`;
          default:
            return `Invalid input`;
        }
      };
    };
    $ZodRegistry = class {
      constructor() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
      }
      add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
        return this;
      }
      clear() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
        return this;
      }
      remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
        this._map.delete(schema);
        return this;
      }
      get(schema) {
        const p4 = schema._zod.parent;
        if (p4) {
          const pm = { ...this.get(p4) ?? {} };
          delete pm.id;
          const f5 = {
            ...pm,
            ...this._map.get(schema)
          };
          return Object.keys(f5).length ? f5 : void 0;
        }
        return this._map.get(schema);
      }
      has(schema) {
        return this._map.has(schema);
      }
    };
    (_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
    globalRegistry = globalThis.__zod_globalRegistry;
    FOLDABLE_KEYS = /* @__PURE__ */ new Set([
      "type",
      "properties",
      "required",
      "additionalProperties"
    ]);
    UNION_KEYS = ["oneOf", "anyOf"];
    createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
      const ctx = initializeContext({
        ...params,
        processors
      });
      processSchema(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
      const { libraryOptions, target } = params ?? {};
      const ctx = initializeContext({
        ...libraryOptions ?? {},
        target,
        io,
        processors
      });
      processSchema(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    narrowMin = (agg, key, value) => {
      if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
    };
    narrowMax = (agg, key, value) => {
      if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
    };
    narrowBoth = (agg, value) => {
      narrowMin(agg, "minimum", value);
      narrowMax(agg, "maximum", value);
    };
    addDivisor = (agg, value) => {
      agg.multipleOf ?? (agg.multipleOf = []);
      if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
    };
    addPattern = (agg, pattern) => {
      agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
      agg.patterns.add(pattern);
    };
    intersectMime = (agg, mime) => {
      agg.mime = agg.mime ? agg.mime.filter((m4) => mime.includes(m4)) : [...mime];
    };
    setFormat = (agg, format) => {
      agg.format = format;
      if (format.includes("int")) agg.isInt = true;
    };
    minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
    maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
    formatContributor = (ranges) => (agg, def) => {
      setFormat(agg, def.format);
      const [minimum, maximum] = ranges[def.format];
      narrowMin(agg, "minimum", minimum);
      narrowMax(agg, "maximum", maximum);
    };
    contributors = {
      greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
      less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
      multiple_of: (agg, def) => addDivisor(agg, def.value),
      number_format: formatContributor(NUMBER_FORMAT_RANGES),
      bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
      min_length: minContributor,
      max_length: maxContributor,
      length_equals: (agg, def) => narrowBoth(agg, def.length),
      min_size: minContributor,
      max_size: maxContributor,
      size_equals: (agg, def) => narrowBoth(agg, def.size),
      string_format: (agg, def) => {
        setFormat(agg, def.format);
        if (def.pattern) addPattern(agg, def.pattern);
        if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
        if (def.local || def.precision === -1) agg.laxFormat = true;
      },
      mime_type: (agg, def) => intersectMime(agg, def.mime)
    };
    formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
    };
    exactPatterns = /* @__PURE__ */ new Map([[base64Charset, base64], [base64urlCharset, base64url]]);
    exactPattern = (p4) => exactPatterns.get(p4) ?? p4;
    stringProcessor = (schema, ctx, _json, _params) => {
      const json = _json;
      json.type = "string";
      const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
      if (typeof minimum === "number") json.minLength = minimum;
      if (typeof maximum === "number") json.maxLength = maximum;
      if (format) {
        json.format = formatMap[format] ?? format;
        if (json.format === "") delete json.format;
        if (format === "time" || laxFormat) delete json.format;
      }
      if (contentEncoding) json.contentEncoding = contentEncoding;
      if (patterns && patterns.size > 0) {
        const patternList = [...patterns].map(exactPattern);
        if (patternList.length === 1) json.pattern = patternList[0].source;
        else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))];
      }
    };
    neverProcessor = (_schema, _ctx, json, _params) => {
      json.not = {};
    };
    enumProcessor = (schema, _ctx, json, _params) => {
      const def = schema._zod.def;
      const values = getEnumValues(def.entries);
      if (values.length === 0) {
        json.not = {};
        return;
      }
      if (values.every((v4) => typeof v4 === "number")) json.type = "number";
      if (values.every((v4) => typeof v4 === "string")) json.type = "string";
      json.enum = values;
    };
    customProcessor = (schema, ctx, json, params) => {
      handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
    };
    transformProcessor = (schema, ctx, json, params) => {
      handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
    };
    arrayProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      const { minimum, maximum } = aggregateChecks(schema);
      if (typeof minimum === "number") json.minItems = minimum;
      if (typeof maximum === "number") json.maxItems = maximum;
      json.type = "array";
      json.items = processSchema(def.element, ctx, {
        ...params,
        path: [...params.path, "items"]
      });
    };
    objectProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      const shape = def.shape;
      if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
      json.type = "object";
      json.properties = {};
      for (const key in shape) assignProp(json.properties, key, processSchema(shape[key], ctx, {
        ...params,
        path: [
          ...params.path,
          "properties",
          key
        ]
      }));
      const requiredKeys = [];
      for (const key of Object.keys(shape)) {
        const field = def.shape[key];
        if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
      }
      if (requiredKeys.length > 0) json.required = requiredKeys;
      if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
      else if (!def.catchall) {
        if (ctx.io === "output") json.additionalProperties = false;
      } else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
        ...params,
        path: [...params.path, "additionalProperties"]
      });
    };
    unionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const isExclusive = def.inclusive === false;
      const options = def.options.map((x4, i5) => processSchema(x4, ctx, {
        ...params,
        path: [
          ...params.path,
          isExclusive ? "oneOf" : "anyOf",
          i5
        ]
      }));
      if (isExclusive) json.oneOf = options;
      else json.anyOf = options;
    };
    intersectionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const a5 = processSchema(def.left, ctx, {
        ...params,
        path: [
          ...params.path,
          "allOf",
          0
        ]
      });
      const b3 = processSchema(def.right, ctx, {
        ...params,
        path: [
          ...params.path,
          "allOf",
          1
        ]
      });
      const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
      const allOf = [...isSimpleIntersection(a5) ? a5.allOf : [a5], ...isSimpleIntersection(b3) ? b3.allOf : [b3]];
      json.allOf = allOf;
      ctx.intersections.push(allOf);
    };
    nullableProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const inner = processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      if (ctx.target === "openapi-3.0") {
        seen.ref = def.innerType;
        json.nullable = true;
      } else json.anyOf = [inner, { type: "null" }];
    };
    nonoptionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    UNREPRESENTABLE_DEFAULT = /* @__PURE__ */ Symbol();
    defaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
      if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
    };
    prefaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      if (ctx.io !== "input") return;
      const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
      if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
    };
    catchProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      let catchValue;
      try {
        catchValue = def.catchValue(void 0);
      } catch {
        handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
        return;
      }
      json.default = catchValue;
    };
    pipeProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      const inIsTransform = def.in._zod.traits.has("$ZodTransform");
      const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
      processSchema(innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = innerType;
    };
    readonlyProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      json.readOnly = true;
    };
    optionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      processSchema(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
    initializer = (inst, issues) => {
      $ZodError.init(inst, issues);
      inst.name = "ZodError";
      const proto = Object.getPrototypeOf(inst);
      if (_installedErrorProtos.has(proto)) return;
      _installedErrorProtos.add(proto);
      _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
      _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
      _lazyMethod(proto, "addIssue", (self) => (issue2) => {
        self.issues.push(issue2);
        self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
      });
      _lazyMethod(proto, "addIssues", (self) => (issues2) => {
        self.issues.push(...issues2);
        self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
      });
      Object.defineProperty(proto, "isEmpty", {
        configurable: true,
        enumerable: false,
        get() {
          return this.issues.length === 0;
        }
      });
    };
    ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, void 0, { Parent: Error });
    parse = /* @__PURE__ */ _parse(ZodRealError);
    parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
    safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
    safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
    encode = /* @__PURE__ */ _encode(ZodRealError);
    decode = /* @__PURE__ */ _decode(ZodRealError);
    encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
    decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
    safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
    safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
    safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
    safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
    ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
      _ensureDefaultLocale();
      $ZodType.init(inst, def);
      inst.def = def;
      inst.type = def.type;
      return inst;
    }, {
      check(...chks) {
        const def = this.def;
        return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
          check: ch,
          def: { check: "custom" },
          onattach: []
        } } : ch)] }), { parent: true });
      },
      with(...chks) {
        return this.check(...chks);
      },
      clone(def, params) {
        return clone(this, def, params);
      },
      brand() {
        return this;
      },
      register(reg, meta) {
        reg.add(this, meta);
        return this;
      },
      refine(check2, params) {
        return this.check(refine(check2, params));
      },
      superRefine(refinement, params) {
        return this.check(superRefine(refinement, params));
      },
      overwrite(fn) {
        return this.check(/* @__PURE__ */ _overwrite(fn));
      },
      optional() {
        return optional(this);
      },
      exactOptional() {
        return exactOptional(this);
      },
      nullable() {
        return nullable(this);
      },
      nullish() {
        return optional(nullable(this));
      },
      nonoptional(params) {
        return nonoptional(this, params);
      },
      array() {
        return array(this);
      },
      or(arg) {
        return union([this, arg]);
      },
      and(arg) {
        return intersection(this, arg);
      },
      transform(tx) {
        return pipe(this, transform(tx));
      },
      default(d4) {
        return _default(this, d4);
      },
      prefault(d4) {
        return prefault(this, d4);
      },
      catch(params) {
        return _catch(this, params);
      },
      pipe(target) {
        return pipe(this, target);
      },
      readonly() {
        return readonly(this);
      },
      describe(description) {
        const cl = this.clone();
        globalRegistry.add(cl, { description });
        return cl;
      },
      meta(...args) {
        if (args.length === 0) return globalRegistry.get(this);
        const cl = this.clone();
        globalRegistry.add(cl, args[0]);
        return cl;
      },
      isOptional() {
        return this.safeParse(void 0).success;
      },
      isNullable() {
        return this.safeParse(null).success;
      },
      apply(fn, ...args) {
        return args.length === 0 ? fn(this) : fn(this, ...args);
      },
      get "~standard"() {
        return hide(this, "~standard", {
          ...standardProps(this),
          jsonSchema: {
            input: createStandardJSONSchemaMethod(this, "input"),
            output: createStandardJSONSchemaMethod(this, "output")
          }
        });
      },
      set "~standard"(value) {
        own(this, "~standard", value);
      },
      parse: function _parse2(data, params) {
        return parse(this, data, params, { callee: _parse2 });
      },
      parseAsync: async function _parseAsync2(data, params) {
        return await parseAsync(this, data, params, { callee: _parseAsync2 });
      },
      safeParse(data, params) {
        return safeParse(this, data, params);
      },
      async safeParseAsync(data, params) {
        return safeParseAsync(this, data, params);
      },
      get spa() {
        return this?.safeParseAsync;
      },
      set spa(value) {
        own(this, "spa", value);
      },
      validate(data, params) {
        return validate(this, data, params);
      },
      validateAsync(data, params) {
        return validateAsync$1(this, data, params);
      },
      encode: function _encode2(data, params) {
        return encode(this, data, params, { callee: _encode2 });
      },
      decode: function _decode2(data, params) {
        return decode(this, data, params, { callee: _decode2 });
      },
      encodeAsync: async function _encodeAsync2(data, params) {
        return await encodeAsync(this, data, params, { callee: _encodeAsync2 });
      },
      decodeAsync: async function _decodeAsync2(data, params) {
        return await decodeAsync(this, data, params, { callee: _decodeAsync2 });
      },
      safeEncode(data, params) {
        return safeEncode(this, data, params);
      },
      safeDecode(data, params) {
        return safeDecode(this, data, params);
      },
      async safeEncodeAsync(data, params) {
        return safeEncodeAsync(this, data, params);
      },
      async safeDecodeAsync(data, params) {
        return safeDecodeAsync(this, data, params);
      },
      toJSONSchema(params) {
        return createToJSONSchemaMethod(this, {})(params);
      },
      get description() {
        return globalRegistry.get(this)?.description;
      },
      get _def() {
        return this._zod.def;
      }
    });
    _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
      $ZodString.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
    }, /* @__PURE__ */ derived({
      format: (inst) => aggregateChecks(inst).format ?? null,
      minLength: (inst) => aggregateChecks(inst).minimum ?? null,
      maxLength: (inst) => aggregateChecks(inst).maximum ?? null
    }, {
      regex(...args) {
        return this.check(/* @__PURE__ */ _regex(...args));
      },
      includes(...args) {
        return this.check(/* @__PURE__ */ _includes(...args));
      },
      startsWith(...args) {
        return this.check(/* @__PURE__ */ _startsWith(...args));
      },
      endsWith(...args) {
        return this.check(/* @__PURE__ */ _endsWith(...args));
      },
      min(...args) {
        return this.check(/* @__PURE__ */ _minLength(...args));
      },
      max(...args) {
        return this.check(/* @__PURE__ */ _maxLength(...args));
      },
      length(...args) {
        return this.check(/* @__PURE__ */ _length(...args));
      },
      nonempty(...args) {
        return this.check(/* @__PURE__ */ _minLength(1, ...args));
      },
      lowercase(params) {
        return this.check(/* @__PURE__ */ _lowercase(params));
      },
      uppercase(params) {
        return this.check(/* @__PURE__ */ _uppercase(params));
      },
      trim() {
        return this.check(/* @__PURE__ */ _trim());
      },
      normalize(...args) {
        return this.check(/* @__PURE__ */ _normalize(...args));
      },
      toLowerCase() {
        return this.check(/* @__PURE__ */ _toLowerCase());
      },
      toUpperCase() {
        return this.check(/* @__PURE__ */ _toUpperCase());
      },
      slugify() {
        return this.check(/* @__PURE__ */ _slugify());
      }
    }));
    ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
      $ZodString.init(inst, def);
      _ZodString.init(inst, def);
    }, {
      email(params) {
        return this.check(/* @__PURE__ */ _email(ZodEmail, params));
      },
      url(params) {
        return this.check(/* @__PURE__ */ _url(ZodURL, params));
      },
      jwt(params) {
        return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
      },
      emoji(params) {
        return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
      },
      guid(params) {
        return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
      },
      uuid(params) {
        return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
      },
      uuidv4(params) {
        return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
      },
      uuidv6(params) {
        return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
      },
      uuidv7(params) {
        return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
      },
      nanoid(params) {
        return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
      },
      cuid(params) {
        return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
      },
      cuid2(params) {
        return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
      },
      ulid(params) {
        return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
      },
      base64(params) {
        return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
      },
      base64url(params) {
        return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
      },
      xid(params) {
        return this.check(/* @__PURE__ */ _xid(ZodXID, params));
      },
      ksuid(params) {
        return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
      },
      ipv4(params) {
        return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
      },
      ipv6(params) {
        return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
      },
      cidrv4(params) {
        return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
      },
      cidrv6(params) {
        return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
      },
      e164(params) {
        return this.check(/* @__PURE__ */ _e164(ZodE164, params));
      },
      datetime(params) {
        return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
      },
      date(params) {
        return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
      },
      time(params) {
        return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
      },
      duration(params) {
        return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
      }
    });
    ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      _ZodString.init(inst, def);
    });
    ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
      $ZodISODateTime.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
      $ZodISODate.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
      $ZodISOTime.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
      $ZodISODuration.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
      $ZodEmail.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
      $ZodGUID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
      $ZodUUID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
      $ZodURL.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
      $ZodEmoji.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
      $ZodNanoID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
      $ZodCUID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
      $ZodCUID2.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
      $ZodULID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
      $ZodXID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
      $ZodKSUID.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
      $ZodIPv4.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
      $ZodIPv6.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
      $ZodCIDRv4.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
      $ZodCIDRv6.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
      $ZodBase64.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
      $ZodBase64URL.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
      $ZodE164.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
      $ZodJWT.init(inst, def);
      ZodStringFormat.init(inst, def);
    });
    ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
      $ZodUnknown.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => void 0;
    });
    ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
      $ZodNever.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
    });
    ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
      _ensureDefaultMemoizer();
      $ZodArray.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
      inst.element = def.element;
    }, {
      min(n3, params) {
        return this.check(/* @__PURE__ */ _minLength(n3, params));
      },
      nonempty(params) {
        return this.check(/* @__PURE__ */ _minLength(1, params));
      },
      max(n3, params) {
        return this.check(/* @__PURE__ */ _maxLength(n3, params));
      },
      length(n3, params) {
        return this.check(/* @__PURE__ */ _length(n3, params));
      },
      unwrap() {
        return this.element;
      }
    });
    ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
      _ensureDefaultMemoizer();
      $ZodObjectJIT.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
      installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
    }, {
      keyof() {
        return _enum(Object.keys(this._zod.def.shape));
      },
      catchall(catchall) {
        return this.clone(mergeDefs(this._zod.def, { catchall }));
      },
      passthrough() {
        return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
      },
      loose() {
        return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
      },
      strict() {
        return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
      },
      strip() {
        return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
      },
      extend(incoming) {
        return extend(this, incoming);
      },
      safeExtend(incoming) {
        return safeExtend(this, incoming);
      },
      merge(other) {
        return merge(this, other);
      },
      pick(mask) {
        return pick(this, mask);
      },
      omit(mask) {
        return omit(this, mask);
      },
      partial(...args) {
        return partial(ZodOptional, this, args[0]);
      },
      exactPartial(...args) {
        return partial(ZodExactOptional, this, args[0], "exactPartial");
      },
      required(...args) {
        return required(ZodNonOptional, this, args[0]);
      }
    });
    ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
      $ZodUnion.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
      inst.options = def.options;
    });
    ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
      $ZodIntersection.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
    });
    ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
      $ZodEnum.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
      inst.enum = def.entries;
      inst.options = [...inst._zod.values];
      const keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
        else throw new Error(`Key ${value} not found in enum`);
        return new ZodEnum({
          ...def,
          checks: [],
          ...normalizeParams(params),
          entries: newEntries
        });
      };
      inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) if (keys.has(value)) delete newEntries[value];
        else throw new Error(`Key ${value} not found in enum`);
        return new ZodEnum({
          ...def,
          checks: [],
          ...normalizeParams(params),
          entries: newEntries
        });
      };
    });
    ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
      _ensureDefaultMemoizer();
      $ZodTransform.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
      inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
        payload.addIssue = (issue$1) => {
          if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
          else {
            const _issue = issue$1;
            if (_issue.fatal) _issue.continue = false;
            _issue.code ?? (_issue.code = "custom");
            if (!("input" in _issue)) _issue.input = payload.value;
            _issue.inst ?? (_issue.inst = inst);
            payload.issues.push(issue(_issue));
          }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) return output.then((output2) => {
          payload.value = output2;
          return payload;
        });
        payload.value = output;
        return payload;
      };
    });
    ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
      $ZodOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
      $ZodExactOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
      $ZodNullable.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
      $ZodDefault.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeDefault = inst.unwrap;
    });
    ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
      $ZodPrefault.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
      $ZodNonOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
      $ZodCatch.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeCatch = inst.unwrap;
    });
    ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
      $ZodPipe.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
      inst.in = def.in;
      inst.out = def.out;
    });
    ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
      $ZodReadonly.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
      $ZodCustom.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
    });
    ZodIssueCode = {
      invalid_type: "invalid_type",
      too_big: "too_big",
      too_small: "too_small",
      invalid_format: "invalid_format",
      not_multiple_of: "not_multiple_of",
      unrecognized_keys: "unrecognized_keys",
      invalid_union: "invalid_union",
      invalid_key: "invalid_key",
      invalid_element: "invalid_element",
      invalid_value: "invalid_value",
      custom: "custom"
    };
    ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {});
    ALGORITHMS = {
      "SHA-256": "sha256-",
      "SHA-384": "sha384-",
      "SHA-512": "sha512-"
    };
    ALGORITHM_VALUES = Object.values(ALGORITHMS);
    _enum(Object.keys(ALGORITHMS)).optional().default("SHA-256");
    cspHashSchema = custom((value) => {
      if (typeof value !== "string") return false;
      return ALGORITHM_VALUES.some((allowedValue) => {
        return value.startsWith(allowedValue);
      });
    });
    cspKindSchema = _enum([
      "element",
      "attribute",
      "default"
    ]);
    ATTRIBUTE_ALLOWED_RESOURCES = [
      "'none'",
      "'unsafe-hashes'",
      "'unsafe-inline'",
      "'report-sample'"
    ];
    union([string(), object({
      resource: string(),
      kind: cspKindSchema
    })]).superRefine((value, ctx) => {
      const resource = typeof value === "string" ? value : value.resource;
      const kind = typeof value === "string" ? "default" : value.kind;
      if (kind === "element" && resource === "'unsafe-hashes'") ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `The source \`'unsafe-hashes'\` is not valid for \`element\` resources (it is rejected by \`script-src-elem\`/\`style-src-elem\`).`,
        fatal: true
      });
      else if (kind === "attribute" && !ATTRIBUTE_ALLOWED_RESOURCES.includes(resource)) ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `The source \`${resource}\` is not valid for \`attribute\` resources. \`script-src-attr\`/\`style-src-attr\` only accept: ${ATTRIBUTE_ALLOWED_RESOURCES.join(", ")}.`,
        fatal: true
      });
    });
    union([cspHashSchema, object({
      hash: cspHashSchema,
      kind: cspKindSchema
    })]);
    ALLOWED_DIRECTIVES = [
      "base-uri",
      "child-src",
      "connect-src",
      "default-src",
      "fenced-frame-src",
      "font-src",
      "form-action",
      "frame-ancestors",
      "frame-src",
      "img-src",
      "manifest-src",
      "media-src",
      "object-src",
      "referrer",
      "report-to",
      "report-uri",
      "require-trusted-types-for",
      "sandbox",
      "trusted-types",
      "upgrade-insecure-requests",
      "worker-src"
    ];
    custom((v4) => typeof v4 === "string").superRefine((value, ctx) => {
      if (!ALLOWED_DIRECTIVES.some((allowedValue) => {
        return value.startsWith(allowedValue);
      })) {
        if (value.startsWith("script-src") || value.startsWith("style-src")) ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Directives \`script-src\` and \`style-src\` (including their \`-elem\`/\`-attr\` variants) are not allowed in \`security.csp.directives\`. Please use \`security.csp.scriptDirective\` and \`security.csp.styleDirective\` instead, scoping resources/hashes to the more specific directives with the \`kind\` option (\`"element"\` or \`"attribute"\`).`,
          fatal: true
        });
        else ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Invalid directive: "${value}". Allowed directives are: ${ALLOWED_DIRECTIVES.join(", ")}`,
          fatal: true
        });
      }
    });
    ALGORITHM = "AES-GCM";
    encoder$1 = new TextEncoder();
    decoder$1 = new TextDecoder();
    IV_LENGTH = 24;
    ASTRO_GENERATOR = `Astro v7.3.7`;
    ASTRO_ERROR_HEADER = "X-Astro-Error";
    DEFAULT_404_COMPONENT = "astro-default-404.astro";
    REDIRECT_STATUS_CODES = [
      301,
      302,
      303,
      307,
      308,
      300,
      304
    ];
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = /* @__PURE__ */ Symbol.for("astro.clientAddress");
    originPathnameSymbol = /* @__PURE__ */ Symbol.for("astro.originPathname");
    fetchStateSymbol = /* @__PURE__ */ Symbol.for("astro.fetchState");
    responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
    e = globalThis.process || {};
    t = e.argv || [];
    n = e.env || {};
    r$1 = !(n.NO_COLOR || t.includes(`--no-color`)) && (!!n.FORCE_COLOR || t.includes(`--color`) || e.platform === `win32` || (e.stdout || {}).isTTY && n.TERM !== `dumb` || !!n.CI);
    i = (e4, t4, n3 = e4) => (r5) => {
      let i5 = `` + r5, o5 = i5.indexOf(t4, e4.length);
      return ~o5 ? e4 + a(i5, t4, n3, o5) + t4 : e4 + i5 + t4;
    };
    a = (e4, t4, n3, r5) => {
      let i5 = ``, a5 = 0;
      do
        i5 += e4.substring(a5, r5) + n3, a5 = r5 + t4.length, r5 = e4.indexOf(t4, a5);
      while (~r5);
      return i5 + e4.substring(a5);
    };
    o = (e4 = r$1) => {
      let t4 = e4 ? i : () => String;
      return {
        isColorSupported: e4,
        reset: t4(`\x1B[0m`, `\x1B[0m`),
        bold: t4(`\x1B[1m`, `\x1B[22m`, `\x1B[22m\x1B[1m`),
        dim: t4(`\x1B[2m`, `\x1B[22m`, `\x1B[22m\x1B[2m`),
        italic: t4(`\x1B[3m`, `\x1B[23m`),
        underline: t4(`\x1B[4m`, `\x1B[24m`),
        inverse: t4(`\x1B[7m`, `\x1B[27m`),
        hidden: t4(`\x1B[8m`, `\x1B[28m`),
        strikethrough: t4(`\x1B[9m`, `\x1B[29m`),
        black: t4(`\x1B[30m`, `\x1B[39m`),
        red: t4(`\x1B[31m`, `\x1B[39m`),
        green: t4(`\x1B[32m`, `\x1B[39m`),
        yellow: t4(`\x1B[33m`, `\x1B[39m`),
        blue: t4(`\x1B[34m`, `\x1B[39m`),
        magenta: t4(`\x1B[35m`, `\x1B[39m`),
        cyan: t4(`\x1B[36m`, `\x1B[39m`),
        white: t4(`\x1B[37m`, `\x1B[39m`),
        gray: t4(`\x1B[90m`, `\x1B[39m`),
        bgBlack: t4(`\x1B[40m`, `\x1B[49m`),
        bgRed: t4(`\x1B[41m`, `\x1B[49m`),
        bgGreen: t4(`\x1B[42m`, `\x1B[49m`),
        bgYellow: t4(`\x1B[43m`, `\x1B[49m`),
        bgBlue: t4(`\x1B[44m`, `\x1B[49m`),
        bgMagenta: t4(`\x1B[45m`, `\x1B[49m`),
        bgCyan: t4(`\x1B[46m`, `\x1B[49m`),
        bgWhite: t4(`\x1B[47m`, `\x1B[49m`),
        blackBright: t4(`\x1B[90m`, `\x1B[39m`),
        redBright: t4(`\x1B[91m`, `\x1B[39m`),
        greenBright: t4(`\x1B[92m`, `\x1B[39m`),
        yellowBright: t4(`\x1B[93m`, `\x1B[39m`),
        blueBright: t4(`\x1B[94m`, `\x1B[39m`),
        magentaBright: t4(`\x1B[95m`, `\x1B[39m`),
        cyanBright: t4(`\x1B[96m`, `\x1B[39m`),
        whiteBright: t4(`\x1B[97m`, `\x1B[39m`),
        bgBlackBright: t4(`\x1B[100m`, `\x1B[49m`),
        bgRedBright: t4(`\x1B[101m`, `\x1B[49m`),
        bgGreenBright: t4(`\x1B[102m`, `\x1B[49m`),
        bgYellowBright: t4(`\x1B[103m`, `\x1B[49m`),
        bgBlueBright: t4(`\x1B[104m`, `\x1B[49m`),
        bgMagentaBright: t4(`\x1B[105m`, `\x1B[49m`),
        bgCyanBright: t4(`\x1B[106m`, `\x1B[49m`),
        bgWhiteBright: t4(`\x1B[107m`, `\x1B[49m`)
      };
    };
    s = o();
    ROUTE404_RE = /^\/404\/?$/;
    ROUTE500_RE = /^\/500\/?$/;
    ESCAPABLE = /[&<>'"]/g;
    HTMLBytes = class extends Uint8Array {
    };
    Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, { get() {
      return "HTMLBytes";
    } });
    htmlStringSymbol = /* @__PURE__ */ Symbol.for("astro:html-string");
    HTMLString = class extends String {
    };
    Object.defineProperty(HTMLString.prototype, htmlStringSymbol, { value: true });
    markHTMLString = (value) => {
      if (isHTMLString(value)) return value;
      if (typeof value === "string") return new HTMLString(value);
      return value;
    };
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
      Infinity: 11
    };
    transitionDirectivesToCopyOnIsland = /* @__PURE__ */ new Set([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = 61;
    headAndContentSym = /* @__PURE__ */ Symbol.for("astro.headAndContent");
    astro_island_prebuilt_default = `(()=>{var g=Object.defineProperty;var w=(a,s,c)=>s in a?g(a,s,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[s]=c;var l=(a,s,c)=>w(a,typeof s!="symbol"?s+"":s,c);var E=new Set(["__proto__","constructor","prototype"]);{let a={0:t=>y(t),1:t=>c(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(c(t)),5:t=>new Set(c(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in a?a[p](e):void 0},c=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let r=this.querySelectorAll("astro-slot"),n={},d=this.querySelectorAll("template[data-astro-template]");for(let o of d){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(n[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of r){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(n[o.getAttribute("name")||"default"]=o.innerHTML)}let u;try{u=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let i=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(i+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${i}\`,this.getAttribute("props"),o),o}let h;await this.hydrator(this)(this.Component,u,n,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),r.disconnect(),this.childrenConnectedCallback()},r=new MutationObserver(()=>{var n;((n=this.lastChild)==null?void 0:n.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});r.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let r=new URL(e,document.baseURI);return r.searchParams.set("astro-retry",Date.now().toString()),r.toString()}async importWithRetry(e){try{return await import(e)}catch(r){return await new Promise(n=>setTimeout(n,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let r=this.getAttribute("component-url"),n=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:r}});this.dispatchEvent(n)&&console.error(\`[astro-island] Error hydrating \${r}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),r=this.getAttribute("client");if(Astro[r]===void 0){window.addEventListener(\`astro:\${r}\`,()=>this.start(),{once:!0});return}try{await Astro[r](async()=>{let n=this.getAttribute("renderer-url");try{let[d,{default:u}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),n?this.importWithRetry(n):Promise.resolve({default:()=>()=>{}})]),h=this.getAttribute("component-export")||"default";if(h.includes(".")){this.Component=d;for(let m of h.split(".")){if(E.has(m)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,m))throw new Error(\`Invalid component export path: \${h}\`);this.Component=this.Component[m]}}else{if(E.has(h))throw new Error(\`Invalid component export path: \${h}\`);this.Component=d[h]}return this.hydrator=u,this.hydrate}catch(d){return this.handleHydrationError(d),()=>{}}},e,this)}catch(n){this.handleHydrationError(n)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;
    astro_island_prebuilt_dev_default = `(()=>{var g=Object.defineProperty;var w=(c,s,d)=>s in c?g(c,s,{enumerable:!0,configurable:!0,writable:!0,value:d}):c[s]=d;var l=(c,s,d)=>w(c,typeof s!="symbol"?s+"":s,d);var E=new Set(["__proto__","constructor","prototype"]);{let c={0:t=>y(t),1:t=>d(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(d(t)),5:t=>new Set(d(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in c?c[p](e):void 0},d=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let r=this.querySelectorAll("astro-slot"),n={},h=this.querySelectorAll("template[data-astro-template]");for(let o of h){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(n[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of r){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(n[o.getAttribute("name")||"default"]=o.innerHTML)}let m;try{m=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let a=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(a+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${a}\`,this.getAttribute("props"),o),o}let i,u=this.hydrator(this);i=performance.now(),await u(this.Component,m,n,{client:this.getAttribute("client")}),i&&this.setAttribute("client-render-time",(performance.now()-i).toString()),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),r.disconnect(),this.childrenConnectedCallback()},r=new MutationObserver(()=>{var n;((n=this.lastChild)==null?void 0:n.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});r.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let r=new URL(e,document.baseURI);return r.searchParams.set("astro-retry",Date.now().toString()),r.toString()}async importWithRetry(e){try{return await import(e)}catch(r){return await new Promise(n=>setTimeout(n,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let r=this.getAttribute("component-url"),n=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:r}});this.dispatchEvent(n)&&console.error(\`[astro-island] Error hydrating \${r}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),r=this.getAttribute("client");if(Astro[r]===void 0){window.addEventListener(\`astro:\${r}\`,()=>this.start(),{once:!0});return}try{await Astro[r](async()=>{let n=this.getAttribute("renderer-url");try{let[h,{default:m}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),n?this.importWithRetry(n):Promise.resolve({default:()=>()=>{}})]),i=this.getAttribute("component-export")||"default";if(i.includes(".")){this.Component=h;for(let u of i.split(".")){if(E.has(u)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,u))throw new Error(\`Invalid component export path: \${i}\`);this.Component=this.Component[u]}}else{if(E.has(i))throw new Error(\`Invalid component export path: \${i}\`);this.Component=h[i]}return this.hydrator=m,this.hydrate}catch(h){return this.handleHydrationError(h),()=>{}}},e,this)}catch(n){this.handleHydrationError(n)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;
    ISLAND_STYLES = "astro-island,astro-slot,astro-static-slot{display:contents}";
    RenderInstructionSymbol = /* @__PURE__ */ Symbol.for("astro:render");
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|inert|loop|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
    AMPERSAND_REGEX = /&/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    INVALID_ATTR_NAME_CHAR = /[\s"'>/=]/;
    toIdent = (k4) => k4.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match)) return "";
      return index === 0 ? match : match.toUpperCase();
    });
    toAttributeString = (value, shouldEscape = true) => {
      if (!shouldEscape) return value;
      const str = String(value);
      if (!str.includes("&") && !str.includes('"')) return str;
      return str.replace(AMPERSAND_REGEX, "&amp;").replace(DOUBLE_QUOTE_REGEX, "&quot;");
    };
    kebab = (k4) => k4.toLowerCase() === k4 ? k4 : k4.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    toStyleString = (obj) => {
      let output = "";
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (!(typeof value === "string" && value.trim() || typeof value === "number")) continue;
        if (output) output += ";";
        output += key[0] !== "-" && key[1] !== "-" ? `${kebab(key)}:${value}` : `${key}:${value}`;
      }
      return output;
    };
    ATTRIBUTE_KIND = {
      ORDINARY: 0,
      INVALID_NAME: 1,
      STATIC_DIRECTIVE: 2,
      CLASS_LIST: 3,
      STYLE: 4,
      CLASS_NAME: 5,
      BOOLEAN: 6,
      BOOLEAN_IF_BOOLEAN: 7
    };
    noop = () => {
    };
    BufferedRenderer = class {
      chunks = [];
      renderPromise;
      destination;
      /**
      * Determines whether buffer has been flushed
      * to the final destination.
      */
      flushed = false;
      constructor(destination, renderFunction) {
        this.destination = destination;
        this.renderPromise = renderFunction(this);
        if (isPromise(this.renderPromise)) Promise.resolve(this.renderPromise).catch(noop);
      }
      write(chunk) {
        if (this.flushed) this.destination.write(chunk);
        else this.chunks.push(chunk);
      }
      flush() {
        if (this.flushed) throw new Error("The render buffer has already been flushed.");
        this.flushed = true;
        for (const chunk of this.chunks) this.destination.write(chunk);
        return this.renderPromise;
      }
    };
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    isDeno = typeof Deno !== "undefined";
    isWorkerd = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
    HEAD_INSTRUCTION = Object.freeze(createRenderInstruction({ type: "head" }));
    MAYBE_HEAD_INSTRUCTION = Object.freeze(createRenderInstruction({ type: "maybe-head" }));
    SERVER_ISLAND_START = "[if astro]>server-island-start<![endif]";
    renderTemplateResultSym = /* @__PURE__ */ Symbol.for("astro.renderTemplateResult");
    markedHtmlParts = /* @__PURE__ */ new WeakMap();
    RenderTemplateResult = class {
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      wrapped;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions;
      }
      catchExpressionError(index, expression) {
        if (this.wrapped?.has(index)) return expression;
        const wrapped = Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
        (this.wrapped ??= /* @__PURE__ */ new Set()).add(index);
        this.expressions[index] = wrapped;
        return wrapped;
      }
      render(destination) {
        const { expressions } = this;
        const htmlParts = markHtmlParts(this.htmlParts);
        for (let i5 = 0; i5 < htmlParts.length; i5++) {
          const html = htmlParts[i5];
          if (html) destination.write(html);
          if (i5 >= expressions.length) break;
          let exp = expressions[i5];
          if (!(exp || exp === 0)) continue;
          if (isPromise(exp)) exp = this.catchExpressionError(i5, exp);
          const result = renderChild(destination, exp);
          if (isPromise(result)) {
            const startIdx = i5 + 1;
            const remaining = expressions.length - startIdx;
            const flushers = new Array(remaining);
            for (let j5 = 0; j5 < remaining; j5++) {
              let rExp = expressions[startIdx + j5];
              if (isPromise(rExp)) rExp = this.catchExpressionError(startIdx + j5, rExp);
              flushers[j5] = createBufferedRenderer(destination, (bufferDestination) => {
                if (rExp || rExp === 0) return renderChild(bufferDestination, rExp);
              });
            }
            return result.then(() => {
              let k4 = 0;
              const iterate = () => {
                while (k4 < flushers.length) {
                  const rHtml = htmlParts[startIdx + k4];
                  if (rHtml) destination.write(rHtml);
                  const flushResult = flushers[k4++].flush();
                  if (isPromise(flushResult)) return flushResult.then(iterate);
                }
                const lastHtml = htmlParts[htmlParts.length - 1];
                if (lastHtml) destination.write(lastHtml);
              };
              return iterate();
            });
          }
        }
      }
    };
    slotString = /* @__PURE__ */ Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      instructions;
      /**
      * The slot's content as an ordered stream. Unlike `instructions` (which holds
      * position-independent instructions like head/hydration content), scripts are
      * kept inline here so they render at their original position instead of being
      * hoisted to the start of the slot output.
      */
      chunks;
      [slotString];
      constructor(content, instructions, chunks = []) {
        super(content);
        this.instructions = instructions;
        this.chunks = chunks;
        this[slotString] = true;
      }
    };
    SlotRenderInstance = class {
      result;
      slotted;
      constructor(result, slotted) {
        this.result = result;
        this.slotted = slotted;
      }
      /** Must be called at most once per instance. */
      evaluate() {
        const { slotted } = this;
        return typeof slotted === "function" ? slotted(this.result) : slotted;
      }
      render(destination) {
        return renderChild(destination, this.evaluate());
      }
    };
    internalProps = /* @__PURE__ */ new Set([
      "server:component-path",
      "server:component-export",
      "server:component-directive",
      "server:defer"
    ]);
    ServerIslandComponent = class {
      result;
      props;
      slots;
      displayName;
      hostId;
      islandContent;
      componentPath;
      componentExport;
      componentId;
      initPromise;
      constructor(result, props, slots, displayName) {
        this.result = result;
        this.props = props;
        this.slots = slots;
        this.displayName = displayName;
      }
      /**
      * Pre-renders the island slots and records its CSP script hashes. Runs once;
      * later calls (every head-collection pass revisits all propagators) return
      * the first result.
      */
      init() {
        this.initPromise ??= this.initImpl();
        return this.initPromise;
      }
      async initImpl() {
        const content = await this.getIslandContent();
        if (this.result.cspDestination) {
          this.result._metadata.extraScriptHashes.push(await generateCspDigest(SERVER_ISLAND_REPLACER, this.result.cspAlgorithm));
          const contentDigest = await generateCspDigest(content, this.result.cspAlgorithm);
          this.result._metadata.extraScriptHashes.push(contentDigest);
        }
        return createThinHead();
      }
      async render(destination) {
        const hostId = await this.getHostId();
        const islandContent = await this.getIslandContent();
        destination.write(createRenderInstruction({ type: "server-island-runtime" }));
        destination.write(`<!--${SERVER_ISLAND_START}-->`);
        for (const name in this.slots) if (name === "fallback") await renderChild(destination, this.slots.fallback(this.result));
        destination.write(`<script type="module" data-astro-rerun data-island-id="${hostId}">${islandContent}</script>`);
      }
      getComponentPath() {
        if (this.componentPath) return this.componentPath;
        const componentPath = this.props["server:component-path"];
        if (!componentPath) throw new Error(`Could not find server component path`);
        this.componentPath = componentPath;
        return componentPath;
      }
      getComponentExport() {
        if (this.componentExport) return this.componentExport;
        const componentExport = this.props["server:component-export"];
        if (!componentExport) throw new Error(`Could not find server component export`);
        this.componentExport = componentExport;
        return componentExport;
      }
      async getHostId() {
        if (!this.hostId) this.hostId = await crypto.randomUUID();
        return this.hostId;
      }
      async getIslandContent() {
        if (this.islandContent) return this.islandContent;
        const componentPath = this.getComponentPath();
        const componentExport = this.getComponentExport();
        let componentId = (await this.result.getServerIslandNameMap()).get(componentPath);
        if (!componentId) throw new Error(`Could not find server component name ${componentPath}`);
        for (const key2 of Object.keys(this.props)) if (internalProps.has(key2)) delete this.props[key2];
        const renderedSlots = {};
        for (const name in this.slots) if (name !== "fallback") {
          const content = await renderSlotToString(this.result, this.slots[name]);
          const slotContent = content;
          let slotHtml = "";
          if (slotContent.chunks?.length) for (const part of slotContent.chunks) slotHtml += typeof part === "string" ? part : part.content;
          else slotHtml = content.toString();
          renderedSlots[name] = slotHtml;
        }
        const key = await this.result.key;
        const componentExportEncrypted = await encryptString(key, componentExport, `export:${componentId}`);
        const propsEncrypted = Object.keys(this.props).length === 0 ? "" : await encryptString(key, JSON.stringify(this.props), `props:${componentId}`);
        const slotsEncrypted = Object.keys(renderedSlots).length === 0 ? "" : await encryptString(key, JSON.stringify(renderedSlots), `slots:${componentId}`);
        const hostId = await this.getHostId();
        const slash2 = this.result.base.endsWith("/") ? "" : "/";
        let serverIslandUrl = `${this.result.base}${slash2}_server-islands/${componentId}${this.result.trailingSlash === "always" ? "/" : ""}`;
        const potentialSearchParams = createSearchParams(componentExportEncrypted, propsEncrypted, slotsEncrypted);
        const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
        if (useGETRequest) {
          serverIslandUrl += "?" + potentialSearchParams.toString();
          this.result._metadata.extraHead.push(markHTMLString(`<link rel="preload" as="fetch" href="${toAttributeString(serverIslandUrl)}" crossorigin="anonymous">`));
        }
        const headersJson = stringifyForScript(this.result.internalFetchHeaders || {});
        const serverIslandUrlJson = stringifyForScript(serverIslandUrl);
        const method = useGETRequest ? `const headers = new Headers(${headersJson});
let response = await fetch(${serverIslandUrlJson}, { headers });` : `let data = {
	encryptedComponentExport: ${stringifyForScript(componentExportEncrypted)},
	encryptedProps: ${stringifyForScript(propsEncrypted)},
	encryptedSlots: ${stringifyForScript(slotsEncrypted)},
};
const headers = new Headers({ 'Content-Type': 'application/json', ...${headersJson} });
let response = await fetch(${serverIslandUrlJson}, {
	method: 'POST',
	body: JSON.stringify(data),
	headers,
});`;
        this.islandContent = `${method}replaceServerIsland(${stringifyForScript(hostId)}, response);`;
        return this.islandContent;
      }
    };
    renderServerIslandRuntime = () => {
      return `<script>${SERVER_ISLAND_REPLACER}</script>`;
    };
    SERVER_ISLAND_REPLACER = markHTMLString(`async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '${SERVER_ISLAND_START}')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" "));
    Fragment = /* @__PURE__ */ Symbol.for("astro:fragment");
    Renderer = /* @__PURE__ */ Symbol.for("astro:renderer");
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    astroComponentInstanceSym = /* @__PURE__ */ Symbol.for("astro.componentInstance");
    CLIENT_DIRECTIVE_PREFIX = "client:";
    AstroComponentInstance = class {
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = slots;
        for (const name in slots) {
          if (this.slotValues === slots) this.slotValues = {};
          let didRender = false;
          let value = slots[name](result);
          if (result._metadata.routeHasPropagation && isPromise(value)) result._metadata.pendingSlotEvaluations.push(value);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      init(result) {
        if (this.returnValue !== void 0) return this.returnValue;
        this.returnValue = this.factory(result, this.props, this.slotValues);
        if (isPromise(this.returnValue)) this.returnValue.then((resolved) => {
          this.returnValue = resolved;
        }).catch(() => {
        });
        return this.returnValue;
      }
      render(destination) {
        const returnValue = this.init(this.result);
        if (isPromise(returnValue)) return returnValue.then((x4) => this.renderImpl(destination, x4));
        return this.renderImpl(destination, returnValue);
      }
      renderImpl(destination, returnValue) {
        if (isHeadAndContent(returnValue)) return returnValue.content.render(destination);
        else return renderChild(destination, returnValue);
      }
    };
    ClientOnlyPlaceholder$1 = "astro-client-only";
    TemplateFrame = class {
      /** The RenderTemplateResult this frame walks. */
      templateResult;
      /** Resume position: the next `htmlParts`/`expressions` index to process. */
      cursor;
      constructor(templateResult) {
        this.templateResult = templateResult;
        this.cursor = 0;
      }
      storeCursor(index) {
        this.cursor = index;
      }
    };
    StreamingRenderState = class {
      pendingStaticOutput = "";
      isBuffering = false;
      bufferedStaticOutput = "";
      appendStatic(output) {
        if (!output) return;
        if (this.isBuffering) this.bufferedStaticOutput += output;
        else this.pendingStaticOutput += output;
      }
    };
    DOCTYPE_EXP = /<!doctype html/i;
    needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    clientOnlyValues = /* @__PURE__ */ new Set([
      "solid-js",
      "react",
      "preact",
      "vue",
      "svelte"
    ]);
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    ClientOnlyPlaceholder = "astro-client-only";
    hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
    TEMPLATE_ENTER = Object.freeze(createRenderInstruction({ type: "template-enter" }));
    TEMPLATE_EXIT = Object.freeze(createRenderInstruction({ type: "template-exit" }));
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v4, c4) => (v4[c4.charCodeAt(0)] = c4, v4), []);
    "-0123456789_".split("").reduce((v4, c4) => (v4[c4.charCodeAt(0)] = c4, v4), []);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/remote__NpkQAic.mjs
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateLeadingSlashes(path) {
  if (!path) return path;
  return path.replace(MANY_LEADING_SLASHES, "/");
}
function collapseDuplicateSlashes(path) {
  if (!path) return path;
  return path.replace(MANY_SLASHES, "/");
}
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) return path;
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function isInternalPath(path) {
  const prefix = path.slice(0, 2).replace(/\\/g, "/");
  return INTERNAL_PREFIXES.has(prefix) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i5) => {
    if (i5 === 0) return removeTrailingForwardSlash(path);
    else if (i5 === paths.length - 1) return removeLeadingForwardSlash(path);
    else return trimSlashes(path);
  }).join("/");
}
function removeQueryString(path) {
  const index = path.lastIndexOf("?");
  return index > 0 ? path.substring(0, index) : path;
}
function isRemotePath(src) {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  let decoded = trimmed;
  let previousDecoded = "";
  let maxIterations = 10;
  while (decoded !== previousDecoded && maxIterations > 0) {
    previousDecoded = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      break;
    }
    maxIterations--;
  }
  if (/^[a-zA-Z]:/.test(decoded)) return false;
  if (decoded[0] === "/" && /^\/[\w.@-]/.test(decoded)) return false;
  if (decoded[0] === "\\") return true;
  if (decoded.startsWith("//")) return true;
  try {
    const url = new URL(decoded, "http://n");
    if (url.username || url.password) return true;
    if (decoded.includes("@") && !url.pathname.includes("@") && !url.search.includes("@")) return true;
    if (url.origin !== "http://n") {
      if (url.protocol.toLowerCase() === "file:") return false;
      return true;
    }
    if (URL.canParse(decoded)) return true;
    return false;
  } catch {
    return true;
  }
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function stripRequestBase(pathname, base) {
  pathname = collapseDuplicateLeadingSlashes(pathname);
  const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
  if (pathname === baseWithoutTrailingSlash) return "/";
  if (pathname.startsWith(baseWithoutTrailingSlash + "/")) return pathname.slice(baseWithoutTrailingSlash.length);
  return pathname;
}
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) return true;
  else if (!allowWildcard || !hostname.startsWith("*")) return hostname === url.hostname;
  else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) return false;
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) return true;
  else if (!allowWildcard || !pathname.endsWith("*")) return pathname === url.pathname;
  else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) return false;
    return url.pathname.slice(slicedPathname.length).split("/").filter(Boolean).length === 1;
  }
  return false;
}
function isRemoteAllowed(src, { domains, remotePatterns }) {
  if (!URL.canParse(src)) return false;
  const url = new URL(src);
  if (![
    "http:",
    "https:",
    "data:"
  ].includes(url.protocol)) return false;
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
var MANY_LEADING_SLASHES, MANY_SLASHES, MANY_TRAILING_SLASHES, INTERNAL_PREFIXES, JUST_SLASHES, WITH_FILE_EXT;
var init_remote_NpkQAic = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/remote__NpkQAic.mjs"() {
    "use strict";
    MANY_LEADING_SLASHES = /^\/{2,}/;
    MANY_SLASHES = /\/{2,}/g;
    MANY_TRAILING_SLASHES = /\/{2,}$/g;
    INTERNAL_PREFIXES = /* @__PURE__ */ new Set([
      "/_",
      "/@",
      "/.",
      "//"
    ]);
    JUST_SLASHES = /^\/{2,}$/;
    WITH_FILE_EXT = /\/[^/]+\.\w+$/;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/console_DgykGsYt.mjs
function log(opts, level2, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level: level2,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level2)) return;
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level2) {
  return levels[configuredLogLevel] <= levels[level2];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error2(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) globalThis._astroGlobalDebug(...args);
}
function getEventPrefix({ level: level2, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level2 === "error" || level2 === "warn") {
    prefix.push(s.bold(timestamp));
    prefix.push(`[${level2.toUpperCase()}]`);
  } else prefix.push(timestamp);
  if (label) prefix.push(`[${label}]`);
  if (level2 === "error") return s.red(prefix.join(" "));
  if (level2 === "warn") return s.yellow(prefix.join(" "));
  if (prefix.length === 1) return s.dim(prefix[0]);
  return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
function astroToRuntimeLogger(logger) {
  return {
    info(msg) {
      logger.info(null, msg);
    },
    warn(msg) {
      logger.warn(null, msg);
    },
    error(msg) {
      logger.error(null, msg);
    }
  };
}
function matchesLevel(messageLevel, configuredLevel) {
  return levels[messageLevel] >= levels[configuredLevel];
}
function consoleLogDestination(config2 = {}) {
  const { level: level2 = "info" } = config2;
  return { write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) dest = console.info;
    if (!matchesLevel(event.level, level2)) return;
    if (event.label === "SKIP_FORMAT") dest(event.message);
    else dest(getEventPrefix(event) + " " + event.message);
  } };
}
function createConsoleLogger({ level: level2 }) {
  return new AstroLogger({
    level: level2,
    destination: consoleLogDestination()
  });
}
var dateTimeFormat, levels, AstroLogger, AstroIntegrationLogger;
var init_console_DgykGsYt = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/console_DgykGsYt.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    dateTimeFormat = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    levels = {
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      silent: 90
    };
    AstroLogger = class {
      options;
      constructor(options) {
        this.options = options;
      }
      info(label, message, newLine = true) {
        info(this.options, label, message, newLine);
      }
      warn(label, message, newLine = true) {
        warn(this.options, label, message, newLine);
      }
      error(label, message, newLine = true) {
        error2(this.options, label, message, newLine);
      }
      debug(label, ...messages) {
        debug(label, ...messages);
      }
      level() {
        return this.options.level;
      }
      forkIntegrationLogger(label) {
        return new AstroIntegrationLogger(this.options, label);
      }
      setDestination(destination) {
        this.options.destination = destination;
      }
      /**
      * It calls the `close` function of the provided destination, if it exists.
      */
      close() {
        if (this.options.destination.close) this.options.destination.close();
      }
      /**
      * It calls the `flush` function of the provided destination, if it exists.
      */
      flush() {
        if (this.options.destination.flush) this.options.destination.flush();
      }
    };
    AstroIntegrationLogger = class AstroIntegrationLogger2 {
      options;
      label;
      constructor(logging, label) {
        this.options = logging;
        this.label = label;
      }
      /**
      * Creates a new logger instance with a new label, but the same log options.
      */
      fork(label) {
        return new AstroIntegrationLogger2(this.options, label);
      }
      info(message) {
        info(this.options, this.label, message);
      }
      warn(message) {
        warn(this.options, this.label, message);
      }
      error(message) {
        error2(this.options, this.label, message);
      }
      debug(message) {
        debug(this.label, message);
      }
      /**
      * It calls the `flush` function of the provided destination, if it exists.
      */
      flush() {
        if (this.options.destination.flush) this.options.destination.flush();
      }
      /**
      * It calls the `close` function of the provided destination, if it exists.
      */
      close() {
        if (this.options.destination.close) this.options.destination.close();
      }
    };
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/dist/preact.mjs
function m(n3, l4) {
  for (var u5 in l4) n3[u5] = l4[u5];
  return n3;
}
function b(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
}
function k(l4, u5, t4) {
  var i5, r5, o5, e4 = {};
  for (o5 in u5) "key" == o5 ? i5 = u5[o5] : "ref" == o5 ? r5 = u5[o5] : e4[o5] = u5[o5];
  if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n2.call(arguments, 2) : t4), "function" == typeof l4 && null != l4.defaultProps) for (o5 in l4.defaultProps) void 0 === e4[o5] && (e4[o5] = l4.defaultProps[o5]);
  return x(l4, e4, i5, r5, null);
}
function x(n3, t4, i5, r5, o5) {
  var e4 = { type: n3, props: t4, key: i5, ref: r5, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o5 ? ++u : o5, __i: -1, __u: 0 };
  return null == o5 && null != l.vnode && l.vnode(e4), e4;
}
function S(n3) {
  return n3.children;
}
function C(n3, l4) {
  this.props = n3, this.context = l4;
}
function $(n3, l4) {
  if (null == l4) return n3.__ ? $(n3.__, n3.__i + 1) : null;
  for (var u5; l4 < n3.__k.length; l4++) if (null != (u5 = n3.__k[l4]) && null != u5.__e) return u5.__e;
  return "function" == typeof n3.type ? $(n3) : null;
}
function I(n3) {
  if (n3.__P && n3.__d) {
    var u5 = n3.__v, t4 = u5.__e, i5 = [], r5 = [], o5 = m({}, u5);
    o5.__v = u5.__v + 1, l.vnode && l.vnode(o5), q(n3.__P, o5, u5, n3.__n, n3.__P.namespaceURI, 32 & u5.__u ? [t4] : null, i5, null == t4 ? $(u5) : t4, !!(32 & u5.__u), r5), o5.__v = u5.__v, o5.__.__k[o5.__i] = o5, D(i5, o5, r5), u5.__e = u5.__ = null, o5.__e != t4 && P(o5);
  }
}
function P(n3) {
  if (null != (n3 = n3.__) && null != n3.__c) return n3.__e = n3.__c.base = null, n3.__k.some(function(l4) {
    if (null != l4 && null != l4.__e) return n3.__e = n3.__c.base = l4.__e;
  }), P(n3);
}
function A(n3) {
  (!n3.__d && (n3.__d = true) && i2.push(n3) && !H.__r++ || r2 != l.debounceRendering) && ((r2 = l.debounceRendering) || o2)(H);
}
function H() {
  try {
    for (var n3, l4 = 1; i2.length; ) i2.length > l4 && i2.sort(e2), n3 = i2.shift(), l4 = i2.length, I(n3);
  } finally {
    i2.length = H.__r = 0;
  }
}
function L(n3, l4, u5, t4, i5, r5, o5, e4, f5, c4, a5) {
  var s5, h3, p4, v4, y4, _4, g5, m4 = t4 && t4.__k || w, b3 = l4.length;
  for (f5 = T(u5, l4, m4, f5, b3), s5 = 0; s5 < b3; s5++) null != (p4 = u5.__k[s5]) && (h3 = -1 != p4.__i && m4[p4.__i] || d, p4.__i = s5, _4 = q(n3, p4, h3, i5, r5, o5, e4, f5, c4, a5), v4 = p4.__e, p4.ref && h3.ref != p4.ref && (h3.ref && J(h3.ref, null, p4), a5.push(p4.ref, p4.__c || v4, p4)), null == y4 && null != v4 && (y4 = v4), (g5 = !!(4 & p4.__u)) || h3.__k === p4.__k ? (f5 = j(p4, f5, n3, g5), g5 && h3.__e && (h3.__e = null)) : "function" == typeof p4.type && void 0 !== _4 ? f5 = _4 : v4 && (f5 = v4.nextSibling), p4.__u &= -7);
  return u5.__e = y4, f5;
}
function T(n3, l4, u5, t4, i5) {
  var r5, o5, e4, f5, c4, a5 = u5.length, s5 = a5, h3 = 0;
  for (n3.__k = new Array(i5), r5 = 0; r5 < i5; r5++) null != (o5 = l4[r5]) && "boolean" != typeof o5 && "function" != typeof o5 ? ("string" == typeof o5 || "number" == typeof o5 || "bigint" == typeof o5 || o5.constructor == String ? o5 = n3.__k[r5] = x(null, o5, null, null, null) : g(o5) ? o5 = n3.__k[r5] = x(S, { children: o5 }, null, null, null) : void 0 === o5.constructor && o5.__b > 0 ? o5 = n3.__k[r5] = x(o5.type, o5.props, o5.key, o5.ref ? o5.ref : null, o5.__v) : n3.__k[r5] = o5, f5 = r5 + h3, o5.__ = n3, o5.__b = n3.__b + 1, e4 = null, -1 != (c4 = o5.__i = O(o5, u5, f5, s5)) && (s5--, (e4 = u5[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i5 > a5 ? h3-- : i5 < a5 && h3++), "function" != typeof o5.type && (o5.__u |= 4)) : c4 != f5 && (c4 == f5 - 1 ? h3-- : c4 == f5 + 1 ? h3++ : (c4 > f5 ? h3-- : h3++, o5.__u |= 4))) : n3.__k[r5] = null;
  if (s5) for (r5 = 0; r5 < a5; r5++) null != (e4 = u5[r5]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = $(e4)), K(e4, e4));
  return t4;
}
function j(n3, l4, u5, t4) {
  var i5, r5;
  if ("function" == typeof n3.type) {
    for (i5 = n3.__k, r5 = 0; i5 && r5 < i5.length; r5++) i5[r5] && (i5[r5].__ = n3, l4 = j(i5[r5], l4, u5, t4));
    return l4;
  }
  n3.__e != l4 && (t4 && (l4 && n3.type && !l4.parentNode && (l4 = $(n3)), u5.insertBefore(n3.__e, l4 || null)), l4 = n3.__e);
  do {
    l4 = l4 && l4.nextSibling;
  } while (null != l4 && 8 == l4.nodeType);
  return l4;
}
function F(n3, l4) {
  return l4 = l4 || [], null == n3 || "boolean" == typeof n3 || (g(n3) ? n3.some(function(n4) {
    F(n4, l4);
  }) : l4.push(n3)), l4;
}
function O(n3, l4, u5, t4) {
  var i5, r5, o5, e4 = n3.key, f5 = n3.type, c4 = l4[u5], a5 = null != c4 && 0 == (2 & c4.__u);
  if (null === c4 && null == e4 || a5 && e4 == c4.key && f5 == c4.type) return u5;
  if (t4 > (a5 ? 1 : 0)) {
    for (i5 = u5 - 1, r5 = u5 + 1; i5 >= 0 || r5 < l4.length; ) if (null != (c4 = l4[o5 = i5 >= 0 ? i5-- : r5++]) && 0 == (2 & c4.__u) && e4 == c4.key && f5 == c4.type) return o5;
  }
  return -1;
}
function z(n3, l4, u5) {
  "-" == l4[0] ? n3.setProperty(l4, null == u5 ? "" : u5) : n3[l4] = null == u5 ? "" : "number" != typeof u5 || _.test(l4) ? u5 : u5 + "px";
}
function N(n3, l4, u5, t4, i5) {
  var r5, o5;
  n: if ("style" == l4) if ("string" == typeof u5) n3.style.cssText = u5;
  else {
    if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l4 in t4) u5 && l4 in u5 || z(n3.style, l4, "");
    if (u5) for (l4 in u5) t4 && u5[l4] == t4[l4] || z(n3.style, l4, u5[l4]);
  }
  else if ("o" == l4[0] && "n" == l4[1]) r5 = l4 != (l4 = l4.replace(s2, "$1")), o5 = l4.toLowerCase(), l4 = o5 in n3 || "onFocusOut" == l4 || "onFocusIn" == l4 ? o5.slice(2) : l4.slice(2), n3.l || (n3.l = {}), n3.l[l4 + r5] = u5, u5 ? t4 ? u5[a2] = t4[a2] : (u5[a2] = h, n3.addEventListener(l4, r5 ? v : p, r5)) : n3.removeEventListener(l4, r5 ? v : p, r5);
  else {
    if ("http://www.w3.org/2000/svg" == i5) l4 = l4.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l4 && "height" != l4 && "href" != l4 && "list" != l4 && "form" != l4 && "tabIndex" != l4 && "download" != l4 && "rowSpan" != l4 && "colSpan" != l4 && "role" != l4 && "popover" != l4 && l4 in n3) try {
      n3[l4] = null == u5 ? "" : u5;
      break n;
    } catch (n4) {
    }
    "function" == typeof u5 || (null == u5 || false === u5 && "-" != l4[4] ? n3.removeAttribute(l4) : n3.setAttribute(l4, "popover" == l4 && 1 == u5 ? "" : u5));
  }
}
function V(n3) {
  return function(u5) {
    if (this.l) {
      var t4 = this.l[u5.type + n3];
      if (null == u5[c]) u5[c] = h++;
      else if (u5[c] < t4[a2]) return;
      return t4(l.event ? l.event(u5) : u5);
    }
  };
}
function q(n3, u5, t4, i5, r5, o5, e4, f5, c4, a5) {
  var s5, h3, p4, v4, y4, d4, _4, k4, x4, M4, $3, I2, P5, A5, H5, T5 = u5.type;
  if (void 0 !== u5.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), o5 = [f5 = u5.__e = t4.__e]), (s5 = l.__b) && s5(u5);
  n: if ("function" == typeof T5) try {
    if (k4 = u5.props, x4 = T5.prototype && T5.prototype.render, M4 = (s5 = T5.contextType) && i5[s5.__c], $3 = s5 ? M4 ? M4.props.value : s5.__ : i5, t4.__c ? _4 = (h3 = u5.__c = t4.__c).__ = h3.__E : (x4 ? u5.__c = h3 = new T5(k4, $3) : (u5.__c = h3 = new C(k4, $3), h3.constructor = T5, h3.render = Q), M4 && M4.sub(h3), h3.state || (h3.state = {}), h3.__n = i5, p4 = h3.__d = true, h3.__h = [], h3._sb = []), x4 && null == h3.__s && (h3.__s = h3.state), x4 && null != T5.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = m({}, h3.__s)), m(h3.__s, T5.getDerivedStateFromProps(k4, h3.__s))), v4 = h3.props, y4 = h3.state, h3.__v = u5, p4) x4 && null == T5.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), x4 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (x4 && null == T5.getDerivedStateFromProps && k4 !== v4 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(k4, $3), u5.__v == t4.__v || !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(k4, h3.__s, $3)) {
        u5.__v != t4.__v && (h3.props = k4, h3.state = h3.__s, h3.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
          n4 && (n4.__ = u5);
        }), w.push.apply(h3.__h, h3._sb), h3._sb = [], h3.__h.length && e4.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(k4, h3.__s, $3), x4 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v4, y4, d4);
      });
    }
    if (h3.context = $3, h3.props = k4, h3.__P = n3, h3.__e = false, I2 = l.__r, P5 = 0, x4) h3.state = h3.__s, h3.__d = false, I2 && I2(u5), s5 = h3.render(h3.props, h3.state, h3.context), w.push.apply(h3.__h, h3._sb), h3._sb = [];
    else do {
      h3.__d = false, I2 && I2(u5), s5 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++P5 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i5 = m(m({}, i5), h3.getChildContext())), x4 && !p4 && null != h3.getSnapshotBeforeUpdate && (d4 = h3.getSnapshotBeforeUpdate(v4, y4)), A5 = null != s5 && s5.type === S && null == s5.key ? E(s5.props.children) : s5, f5 = L(n3, g(A5) ? A5 : [A5], u5, t4, i5, r5, o5, e4, f5, c4, a5), h3.base = u5.__e, u5.__u &= -161, h3.__h.length && e4.push(h3), _4 && (h3.__E = h3.__ = null);
  } catch (n4) {
    if (u5.__v = null, c4 || null != o5) if (n4.then) {
      for (u5.__u |= c4 ? 160 : 128; f5 && 8 == f5.nodeType && f5.nextSibling; ) f5 = f5.nextSibling;
      o5[o5.indexOf(f5)] = null, u5.__e = f5;
    } else {
      for (H5 = o5.length; H5--; ) b(o5[H5]);
      B(u5);
    }
    else u5.__e = t4.__e, u5.__k = t4.__k, n4.then || B(u5);
    l.__e(n4, u5, t4);
  }
  else null == o5 && u5.__v == t4.__v ? (u5.__k = t4.__k, u5.__e = t4.__e) : f5 = u5.__e = G(t4.__e, u5, t4, i5, r5, o5, e4, c4, a5);
  return (s5 = l.diffed) && s5(u5), 128 & u5.__u ? void 0 : f5;
}
function B(n3) {
  n3 && (n3.__c && (n3.__c.__e = true), n3.__k && n3.__k.some(B));
}
function D(n3, u5, t4) {
  for (var i5 = 0; i5 < t4.length; i5++) J(t4[i5], t4[++i5], t4[++i5]);
  l.__c && l.__c(u5, n3), n3.some(function(u6) {
    try {
      n3 = u6.__h, u6.__h = [], n3.some(function(n4) {
        n4.call(u6);
      });
    } catch (n4) {
      l.__e(n4, u6.__v);
    }
  });
}
function E(n3) {
  return "object" != typeof n3 || null == n3 || n3.__b > 0 ? n3 : g(n3) ? n3.map(E) : void 0 !== n3.constructor ? null : m({}, n3);
}
function G(u5, t4, i5, r5, o5, e4, f5, c4, a5) {
  var s5, h3, p4, v4, y4, w4, _4, m4 = i5.props || d, k4 = t4.props, x4 = t4.type;
  if ("svg" == x4 ? o5 = "http://www.w3.org/2000/svg" : "math" == x4 ? o5 = "http://www.w3.org/1998/Math/MathML" : o5 || (o5 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (s5 = 0; s5 < e4.length; s5++) if ((y4 = e4[s5]) && "setAttribute" in y4 == !!x4 && (x4 ? y4.localName == x4 : 3 == y4.nodeType)) {
      u5 = y4, e4[s5] = null;
      break;
    }
  }
  if (null == u5) {
    if (null == x4) return document.createTextNode(k4);
    u5 = document.createElementNS(o5, x4, k4.is && k4), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
  }
  if (null == x4) m4 === k4 || c4 && u5.data == k4 || (u5.data = k4);
  else {
    if (e4 = "textarea" == x4 && null != k4.defaultValue ? null : e4 && n2.call(u5.childNodes), !c4 && null != e4) for (m4 = {}, s5 = 0; s5 < u5.attributes.length; s5++) m4[(y4 = u5.attributes[s5]).name] = y4.value;
    for (s5 in m4) y4 = m4[s5], "dangerouslySetInnerHTML" == s5 ? p4 = y4 : "children" == s5 || s5 in k4 || "value" == s5 && "defaultValue" in k4 || "checked" == s5 && "defaultChecked" in k4 || N(u5, s5, null, y4, o5);
    for (s5 in k4) y4 = k4[s5], "children" == s5 ? v4 = y4 : "dangerouslySetInnerHTML" == s5 ? h3 = y4 : "value" == s5 ? w4 = y4 : "checked" == s5 ? _4 = y4 : c4 && "function" != typeof y4 || m4[s5] === y4 || N(u5, s5, y4, m4[s5], o5);
    if (h3) c4 || p4 && (h3.__html == p4.__html || h3.__html == u5.innerHTML) || (u5.innerHTML = h3.__html), t4.__k = [];
    else if (p4 && (u5.innerHTML = ""), L("template" == t4.type ? u5.content : u5, g(v4) ? v4 : [v4], t4, i5, r5, "foreignObject" == x4 ? "http://www.w3.org/1999/xhtml" : o5, e4, f5, e4 ? e4[0] : i5.__k && $(i5, 0), c4, a5), null != e4) for (s5 = e4.length; s5--; ) b(e4[s5]);
    c4 && "textarea" != x4 || (s5 = "value", "progress" == x4 && null == w4 ? u5.removeAttribute("value") : null != w4 && (w4 !== u5[s5] || "progress" == x4 && !w4 || "option" == x4 && w4 != m4[s5]) && N(u5, s5, w4, m4[s5], o5), s5 = "checked", null != _4 && _4 != u5[s5] && N(u5, s5, _4, m4[s5], o5));
  }
  return u5;
}
function J(n3, u5, t4) {
  try {
    if ("function" == typeof n3) {
      var i5 = "function" == typeof n3.__u;
      i5 && n3.__u(), i5 && null == u5 || (n3.__u = n3(u5));
    } else n3.current = u5;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function K(n3, u5, t4) {
  var i5, r5;
  if (l.unmount && l.unmount(n3), (i5 = n3.ref) && (i5.current && i5.current != n3.__e || J(i5, null, u5)), null != (i5 = n3.__c)) {
    if (i5.componentWillUnmount) try {
      i5.componentWillUnmount();
    } catch (n4) {
      l.__e(n4, u5);
    }
    i5.base = i5.__P = null;
  }
  if (i5 = n3.__k) for (r5 = 0; r5 < i5.length; r5++) i5[r5] && K(i5[r5], u5, t4 || "function" != typeof n3.type);
  t4 || b(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
}
function Q(n3, l4, u5) {
  return this.constructor(n3, u5);
}
var n2, l, u, t2, i2, r2, o2, e2, f, c, a2, s2, h, p, v, y, d, w, _, g;
var init_preact = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/dist/preact.mjs"() {
    d = {};
    w = [];
    _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    g = Array.isArray;
    n2 = w.slice, l = { __e: function(n3, l4, u5, t4) {
      for (var i5, r5, o5; l4 = l4.__; ) if ((i5 = l4.__c) && !i5.__) try {
        if ((r5 = i5.constructor) && null != r5.getDerivedStateFromError && (i5.setState(r5.getDerivedStateFromError(n3)), o5 = i5.__d), null != i5.componentDidCatch && (i5.componentDidCatch(n3, t4 || {}), o5 = i5.__d), o5) return i5.__E = i5;
      } catch (l5) {
        n3 = l5;
      }
      throw n3;
    } }, u = 0, t2 = function(n3) {
      return null != n3 && void 0 === n3.constructor;
    }, C.prototype.setState = function(n3, l4) {
      var u5;
      u5 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n3 && (n3 = n3(m({}, u5), this.props)), n3 && m(u5, n3), null != n3 && this.__v && (l4 && this._sb.push(l4), A(this));
    }, C.prototype.forceUpdate = function(n3) {
      this.__v && (this.__e = true, n3 && this.__h.push(n3), A(this));
    }, C.prototype.render = S, i2 = [], o2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e2 = function(n3, l4) {
      return n3.__v.__b - l4.__v.__b;
    }, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a2 = "__a" + f, s2 = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/compiler_Cv-Cl9y0.mjs
function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) throw new AstroError({
      ...InvalidComponentArgs,
      message: InvalidComponentArgs.message(name)
    });
    return cb(...args);
  };
  Object.defineProperty(fn, "name", {
    value: name,
    writable: false
  });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
  else return createComponentWithOptions(arg1);
}
var init_compiler_Cv_Cl9y0 = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/compiler_Cv-Cl9y0.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_errors_D7mtj974();
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/noop_CWC3mE6X.mjs
var noop_CWC3mE6X_exports = {};
__export(noop_CWC3mE6X_exports, {
  default: () => noop_default
});
var noop_default;
var init_noop_CWC3mE6X = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/noop_CWC3mE6X.mjs"() {
    "use strict";
    init_generic_DdU7CG9U();
    noop_default = {
      ...baseService,
      propertiesToHash: ["src"],
      async validateOptions(options) {
        if (isESMImportedImage(options.src) && options.src.format === "svg") options.format = "svg";
        else delete options.format;
        verifyOptions(options);
        return options;
      },
      async transform(inputBuffer, transformOptions) {
        return {
          data: inputBuffer,
          format: transformOptions.format
        };
      }
    };
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/generic_DdU7CG9U.mjs
var generic_DdU7CG9U_exports = {};
__export(generic_DdU7CG9U_exports, {
  i: () => isESMImportedImage,
  n: () => baseService,
  page: () => page,
  r: () => verifyOptions,
  t: () => generic___js_exports
});
function isESMImportedImage(src) {
  return typeof src === "object" || typeof src === "function" && "src" in src;
}
function isRemoteImage(src) {
  return typeof src === "string";
}
async function resolveSrc(src) {
  if (typeof src === "object" && "then" in src) {
    const resource = await src;
    return resource.default ?? resource;
  }
  return src;
}
function inferSourceFormat(src) {
  if (src.startsWith(DATA_PREFIX)) {
    const sepIndex = src.indexOf(";");
    const commaIndex = src.indexOf(",");
    const mimeEnd = sepIndex === -1 ? commaIndex : commaIndex === -1 ? sepIndex : Math.min(sepIndex, commaIndex);
    if (mimeEnd === -1) return void 0;
    const mime = src.slice(5, mimeEnd);
    if (mime === "image/svg+xml") return "svg";
    return mime.split("/")[1] || void 0;
  }
  try {
    const cleanSrc = removeQueryString(src).split("#")[0];
    const lastSlash = cleanSrc.lastIndexOf("/");
    const basename = lastSlash === -1 ? cleanSrc : cleanSrc.slice(lastSlash + 1);
    const lastDot = basename.lastIndexOf(".");
    if (lastDot === -1) return void 0;
    return basename.slice(lastDot + 1).toLowerCase();
  } catch {
    return;
  }
}
function resolveDefaultOutputFormat(sourceFormat) {
  return sourceFormat === "svg" ? "svg" : DEFAULT_OUTPUT_FORMAT;
}
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  return methods[`readUInt${bits}${isBigEndian ? "BE" : "LE"}`](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < MIN_BOX_HEADER) return;
  const boxSize = readUInt32BE(input, offset);
  if (boxSize === 0) return {
    name: toUTF8String(input, offset + 4, offset + 8),
    offset,
    size: input.length - offset
  };
  if (boxSize === 1) return;
  if (boxSize < MIN_BOX_HEADER) return;
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, offset + 4, offset + 8),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, startOffset) {
  let offset = startOffset;
  while (offset < input.length) {
    const box = readBox(input, offset);
    if (!box) break;
    if (box.name === boxName) return box;
    if (box.size < MIN_BOX_HEADER) break;
    const nextOffset = offset + box.size;
    if (nextOffset <= offset) break;
    offset = nextOffset;
  }
}
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
function detectType(input, start2, end) {
  let hasAvif = false;
  let hasHeic = false;
  let hasHeif = false;
  for (let i5 = start2; i5 <= end; i5 += 4) {
    const brand = toUTF8String(input, i5, i5 + 4);
    if (brand === "avif" || brand === "avis") hasAvif = true;
    else if (brand === "heic" || brand === "heix" || brand === "hevc" || brand === "hevx") hasHeic = true;
    else if (brand === "mif1" || brand === "msf1") hasHeif = true;
  }
  if (hasAvif) return "avif";
  if (hasHeic) return "heic";
  if (hasHeif) return "heif";
}
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [toUTF8String(input, imageOffset, imageLengthOffset), readUInt32BE(input, imageLengthOffset)];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return {
    width: size,
    height: size,
    type
  };
}
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfDirectoryEntries = readUInt(exifBlock, 16, 14, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start2 = 16 + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start2 + IDF_ENTRY_BYTES;
    if (start2 > exifBlock.length) return;
    const block = exifBlock.slice(start2, end);
    if (readUInt(block, 16, 0, isBigEndian) === 274) {
      if (readUInt(block, 16, 2, isBigEndian) !== 3) return;
      if (readUInt(block, 32, 4, isBigEndian) !== 1) return;
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(exifBlock, EXIF_HEADER_BYTES, 8);
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || byteAlign === LITTLE_ENDIAN_BYTE_ALIGN) return extractOrientation(exifBlock, isBigEndian);
}
function validateInput(input, index) {
  if (index > input.length) throw new TypeError("Corrupt JPG, exceeded buffer limits");
}
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) return 8 * (1 + reader.getBits(5));
  const extraBits = [
    9,
    13,
    18,
    30
  ][reader.getBits(2)];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) return 8 * (1 + reader.getBits(5));
  if (widthMode === 0) return calculateImageDimension(reader, false);
  return Math.floor(height * [
    1,
    1.2,
    4 / 3,
    1.5,
    16 / 9,
    5 / 4,
    2
  ][widthMode - 1]);
}
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox && jxlcBox.size >= 8) return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) return concatenateCodestreams(partialStreams);
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    if (jxlpBox.size < 12) break;
    partialStreams.push(input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size));
    const nextOffset = jxlpBox.offset + jxlpBox.size;
    if (nextOffset <= offset) break;
    offset = nextOffset;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce((acc, curr) => acc + curr.length, 0);
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial2 of partialCodestreams) {
    codestream.set(partial2, position);
    position += partial2.length;
  }
  return codestream;
}
function parseLength(len) {
  const m4 = unitsReg.exec(len);
  if (!m4) return;
  return Math.round(Number(m4[1]) * (units[m4[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = extractorRegExps.width.exec(root);
  const height = extractorRegExps.height.exec(root);
  const viewbox = extractorRegExps.viewbox.exec(root);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) return {
    height: Math.floor(attrs.width / ratio),
    width: attrs.width
  };
  if (attrs.height) return {
    height: attrs.height,
    width: Math.floor(attrs.height * ratio)
  };
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
function readIFD(input, { isBigEndian, isBigTiff }) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(readUInt64(input, offset, isBigEndian));
      if (value > Number.MAX_SAFE_INTEGER) throw new TypeError("Value too large");
      return value;
    }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) return input.slice(entrySize);
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) tags[code] = readTagValue(temp, type, isBigTiff ? 12 : 8, isBigEndian);
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version2 = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version2 === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) throw new TypeError("Invalid BigTIFF header");
}
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) return type;
  return types.find((imageType) => typeHandlers.get(imageType).validate(input));
}
function lookup$1(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}
async function imageMetadata(data, src) {
  let result;
  try {
    result = lookup$1(data);
  } catch {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  if (result.height == null || result.width == null || !result.type) throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(src)
  });
  const { width, height, type, orientation } = result;
  const isPortrait = (orientation || 0) >= 5;
  return {
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}
async function fetchWithRedirects(options) {
  const { url, headers, imageConfig: imageConfig2, fetchFn = globalThis.fetch, redirectLimit = 10, onMaxRedirectsExceeded = (_u) => /* @__PURE__ */ new Error("Maximum redirect depth exceeded"), onMissingLocationHeader = (_s, _u) => /* @__PURE__ */ new Error(`Redirect response ${_s} missing Location header`), onDisallowedRedirect = (_current, _target) => /* @__PURE__ */ new Error(`The image at ${_current} redirected to ${_target}, which is not an allowed remote location.`) } = options;
  if (redirectLimit <= 0) throw onMaxRedirectsExceeded(typeof url === "string" ? url : url.toString());
  const urlString = typeof url === "string" ? url : url.toString();
  const res = await fetchFn(new Request(url, { headers }), { redirect: "manual" });
  if ([
    301,
    302,
    303,
    307,
    308
  ].includes(res.status)) {
    const location = res.headers.get("Location");
    if (!location) throw onMissingLocationHeader(res.status, urlString);
    const redirectUrl = new URL(location, urlString).toString();
    if (!isRemoteAllowed(redirectUrl, {
      domains: imageConfig2.domains ?? [],
      remotePatterns: imageConfig2.remotePatterns ?? []
    })) throw onDisallowedRedirect(urlString, redirectUrl);
    return fetchWithRedirects({
      url: redirectUrl,
      headers,
      imageConfig: imageConfig2,
      fetchFn,
      redirectLimit: redirectLimit - 1,
      onMaxRedirectsExceeded,
      onMissingLocationHeader,
      onDisallowedRedirect
    });
  }
  return res;
}
async function inferRemoteSize$1(url, imageConfig2) {
  if (!URL.canParse(url)) throw new AstroError({
    ...FailedToFetchRemoteImageDimensions,
    message: FailedToFetchRemoteImageDimensions.message(url)
  });
  const allowlistConfig = imageConfig2 ? {
    domains: imageConfig2.domains ?? [],
    remotePatterns: imageConfig2.remotePatterns ?? []
  } : void 0;
  if (!allowlistConfig) {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  if (allowlistConfig && !isRemoteAllowed(url, allowlistConfig)) throw new AstroError({
    ...RemoteImageNotAllowed,
    message: RemoteImageNotAllowed.message(url)
  });
  let response;
  try {
    response = await fetchWithRedirects({
      url,
      onMaxRedirectsExceeded: (u5) => new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(u5)
      }),
      onMissingLocationHeader: (_status, u5) => new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(u5)
      }),
      imageConfig: imageConfig2 ?? {
        remotePatterns: [],
        domains: []
      }
    });
  } catch (_err) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  if (allowlistConfig && !isRemoteAllowed(response.url, allowlistConfig)) throw new AstroError({
    ...RemoteImageNotAllowed,
    message: RemoteImageNotAllowed.message(url)
  });
  if (!response.body || !response.ok) throw new AstroError({
    ...FailedToFetchRemoteImageDimensions,
    message: FailedToFetchRemoteImageDimensions.message(url)
  });
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = /* @__PURE__ */ new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = await imageMetadata(accumulatedChunks, url);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch {
      }
    }
  }
  throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(url)
  });
}
function isLocalService(service) {
  if (!service) return false;
  return "transform" in service;
}
function verifyOptions(options) {
  if (!options.src || !isRemoteImage(options.src) && !isESMImportedImage(options.src)) throw new AstroError({
    ...ExpectedImage,
    message: ExpectedImage.message(JSON.stringify(options.src), typeof options.src, JSON.stringify(options, (_4, v4) => v4 === void 0 ? null : v4))
  });
  if (!isESMImportedImage(options.src)) {
    if (options.src.startsWith("/@fs/") || !isRemotePath(options.src) && !options.src.startsWith("/")) throw new AstroError({
      ...LocalImageUsedWrongly,
      message: LocalImageUsedWrongly.message(options.src)
    });
    let missingDimension;
    if (!options.width && !options.height) missingDimension = "both";
    else if (!options.width && options.height) missingDimension = "width";
    else if (options.width && !options.height) missingDimension = "height";
    if (missingDimension) throw new AstroError({
      ...MissingImageDimension,
      message: MissingImageDimension.message(missingDimension, options.src)
    });
  } else {
    if (!VALID_SUPPORTED_FORMATS.includes(options.src.format)) throw new AstroError({
      ...UnsupportedImageFormat,
      message: UnsupportedImageFormat.message(options.src.format, options.src.src, VALID_SUPPORTED_FORMATS)
    });
    if (options.widths && options.densities) throw new AstroError(IncompatibleDescriptorOptions);
    if (options.src.format !== "svg" && options.format === "svg") throw new AstroError(UnsupportedImageConversion);
  }
}
function getTargetDimensions(options) {
  let targetWidth = options.width;
  let targetHeight = options.height;
  if (isESMImportedImage(options.src)) {
    const aspectRatio = options.src.width / options.src.height;
    if (targetHeight && !targetWidth) targetWidth = Math.round(targetHeight * aspectRatio);
    else if (targetWidth && !targetHeight) targetHeight = Math.round(targetWidth / aspectRatio);
    else if (!targetWidth && !targetHeight) {
      targetWidth = options.src.width;
      targetHeight = options.src.height;
    }
  }
  return {
    targetWidth,
    targetHeight
  };
}
function isImageMetadata(src) {
  return src.fsPath && !("fsPath" in src);
}
function createPlaceholderURL(pathOrUrl) {
  return new URL(pathOrUrl, PLACEHOLDER_BASE);
}
function stringifyPlaceholderURL(url) {
  return url.href.replace(PLACEHOLDER_BASE, "");
}
async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await Promise.resolve().then(() => (init_noop_CWC3mE6X(), noop_CWC3mE6X_exports)).catch((e4) => {
      const error3 = new AstroError(InvalidImageService);
      error3.cause = e4;
      throw error3;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig2, logger) {
  if (!options || typeof options !== "object") throw new AstroError({
    ...ExpectedImageOptions,
    message: ExpectedImageOptions.message(JSON.stringify(options))
  });
  if (typeof options.src === "undefined") throw new AstroError({
    ...ExpectedImage,
    message: ExpectedImage.message(options.src, "undefined", JSON.stringify(options))
  });
  if (isImageMetadata(options)) throw new AstroError(ExpectedNotESMImage);
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  let originalWidth;
  let originalHeight;
  if (resolvedOptions.inferSize) {
    delete resolvedOptions.inferSize;
    if (isRemoteImage(resolvedOptions.src) && isRemotePath(resolvedOptions.src)) {
      if (!isRemoteAllowed(resolvedOptions.src, imageConfig2)) throw new AstroError({
        ...RemoteImageNotAllowed,
        message: RemoteImageNotAllowed.message(resolvedOptions.src)
      });
      const getRemoteSize = (url) => service.getRemoteSize?.(url, imageConfig2, logger) ?? inferRemoteSize$1(url, imageConfig2);
      const result = await getRemoteSize(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      if (result.format) resolvedOptions.format ??= resolveDefaultOutputFormat(result.format);
      originalWidth = result.width;
      originalHeight = result.height;
    }
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.clone ?? resolvedOptions.src : resolvedOptions.src;
  if (isESMImportedImage(clonedSrc)) {
    originalWidth = clonedSrc.width;
    originalHeight = clonedSrc.height;
  }
  if (originalWidth && originalHeight) {
    const aspectRatio = originalWidth / originalHeight;
    if (resolvedOptions.height && !resolvedOptions.width) resolvedOptions.width = Math.round(resolvedOptions.height * aspectRatio);
    else if (resolvedOptions.width && !resolvedOptions.height) resolvedOptions.height = Math.round(resolvedOptions.width / aspectRatio);
    else if (!resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.width = originalWidth;
      resolvedOptions.height = originalHeight;
    }
  }
  resolvedOptions.src = clonedSrc;
  const layout = options.layout ?? imageConfig2.layout ?? "none";
  if (resolvedOptions.priority) {
    resolvedOptions.loading ??= "eager";
    resolvedOptions.decoding ??= "sync";
    resolvedOptions.fetchpriority ??= "high";
    delete resolvedOptions.priority;
  } else {
    resolvedOptions.loading ??= "lazy";
    resolvedOptions.decoding ??= "async";
    resolvedOptions.fetchpriority ??= void 0;
  }
  if (layout !== "none") {
    resolvedOptions.widths ||= getWidths({
      width: resolvedOptions.width,
      layout,
      originalWidth,
      breakpoints: imageConfig2.breakpoints?.length ? imageConfig2.breakpoints : isLocalService(service) ? LIMITED_RESOLUTIONS : DEFAULT_RESOLUTIONS
    });
    resolvedOptions.sizes ||= getSizesAttribute({
      width: resolvedOptions.width,
      layout
    });
    delete resolvedOptions.densities;
    resolvedOptions["data-astro-image"] = layout;
    if (resolvedOptions.fit && cssFitValues.includes(resolvedOptions.fit)) resolvedOptions["data-astro-image-fit"] = resolvedOptions.fit;
    resolvedOptions["data-astro-image-pos"] = (resolvedOptions.position || "center").replace(/\s+/g, "-");
  }
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig2, logger) : resolvedOptions;
  validatedOptions.format ??= await peekRemoteFormatForStaticEmit(validatedOptions, imageConfig2, service, logger);
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig2, logger) : [];
  const lazyImageURLFactory = (getValue) => {
    let cached2 = null;
    return () => cached2 ??= getValue();
  };
  const initialImageURL = await service.getURL(validatedOptions, imageConfig2, logger);
  let lazyImageURL = lazyImageURLFactory(() => initialImageURL);
  const matchesValidatedTransform = (transform2) => transform2.width === validatedOptions.width && transform2.height === validatedOptions.height && transform2.format === validatedOptions.format;
  let srcSets = await Promise.all(srcSetTransforms.map(async (srcSet) => {
    return {
      transform: srcSet.transform,
      url: matchesValidatedTransform(srcSet.transform) ? initialImageURL : await service.getURL(srcSet.transform, imageConfig2, logger),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    };
  }));
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && initialImageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    lazyImageURL = lazyImageURLFactory(() => globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash, originalFilePath));
    srcSets = srcSetTransforms.map((srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesValidatedTransform(srcSet.transform) ? lazyImageURL() : globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    });
  } else if (imageConfig2.assetQueryParams) {
    const imageURLObj = createPlaceholderURL(initialImageURL);
    imageConfig2.assetQueryParams.forEach((value, key) => {
      imageURLObj.searchParams.set(key, value);
    });
    lazyImageURL = lazyImageURLFactory(() => stringifyPlaceholderURL(imageURLObj));
    srcSets = srcSets.map((srcSet) => {
      const urlObj = createPlaceholderURL(srcSet.url);
      imageConfig2.assetQueryParams.forEach((value, key) => {
        urlObj.searchParams.set(key, value);
      });
      return {
        ...srcSet,
        url: stringifyPlaceholderURL(urlObj)
      };
    });
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    get src() {
      return lazyImageURL();
    },
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig2, logger) : {}
  };
}
async function peekRemoteFormatForStaticEmit(options, imageConfig2, service, logger) {
  if (!isRemoteImage(options.src) || !isRemoteAllowed(options.src, imageConfig2) || !globalThis.astroAsset?.addStaticImage || !isLocalService(service) || !service.getRemoteSize) return;
  try {
    return resolveDefaultOutputFormat((await service.getRemoteSize(options.src, imageConfig2, logger)).format);
  } catch {
    return;
  }
}
function lookup(extn) {
  let tmp = ("" + extn).trim().toLowerCase();
  let idx = tmp.lastIndexOf(".");
  return mimes[!~idx ? tmp : tmp.substring(++idx)];
}
function filterPreloads(data, preload) {
  if (!preload) return null;
  if (preload === true) return data;
  return data.filter(({ weight, style, subset }) => preload.some((p4) => {
    if (p4.weight !== void 0 && weight !== void 0 && !checkWeight(p4.weight.toString(), weight)) return false;
    if (p4.style !== void 0 && p4.style !== style) return false;
    if (p4.subset !== void 0 && p4.subset !== subset) return false;
    return true;
  }));
}
function checkWeight(input, target) {
  const trimmedInput = input.trim();
  if (trimmedInput.includes(" ")) return trimmedInput === target;
  if (target.includes(" ")) {
    const [a5, b3] = target.split(" ");
    const parsedInput = Number.parseInt(input);
    return parsedInput >= Number.parseInt(a5) && parsedInput <= Number.parseInt(b3);
  }
  return input === target;
}
async function loadImage(src, headers, imageConfig2, isRemote, fetchFn) {
  try {
    const res = await fetchWithRedirects({
      url: src,
      headers,
      imageConfig: imageConfig2,
      fetchFn
    });
    if (isRemote && !isRemoteAllowed(res.url, imageConfig2)) return;
    if (!res.ok) return;
    return await res.arrayBuffer();
  } catch {
    return;
  }
}
var level, VALID_SUPPORTED_FORMATS, DEFAULT_OUTPUT_FORMAT, DEFAULT_HASH_PROPS, DEFAULT_RESOLUTIONS, LIMITED_RESOLUTIONS, getWidths, getSizesAttribute, DATA_PREFIX, decoder2, toUTF8String, toHexString, getView, readInt16LE, readUInt16BE, readUInt16LE, readUInt24LE, readInt32LE, readUInt32BE, readUInt32LE, readUInt64, methods, MIN_BOX_HEADER, BMP, TYPE_ICON, SIZE_HEADER$1, SIZE_IMAGE_ENTRY, ICO, TYPE_CURSOR, CUR, DDS, gifRegexp, GIF, brandMap, HEIF, SIZE_HEADER, FILE_LENGTH_OFFSET, MIN_ENTRY_LENGTH, ENTRY_LENGTH_OFFSET, ICON_TYPE_SIZE, ICNS, J2C, JP2, EXIF_MARKER, APP1_DATA_SIZE_BYTES, EXIF_HEADER_BYTES, BIG_ENDIAN_BYTE_ALIGN, LITTLE_ENDIAN_BYTE_ALIGN, IDF_ENTRY_BYTES, JPG, BitReader, JXLStream, JXL, KTX, pngSignature, pngImageHeaderChunkName, pngFriedChunkName, PNG, PNMTypes, handlers, PNM, PSD, svgReg, extractorRegExps, INCH_CM, units, unitsReg, SVG, TGA, CONSTANTS, signatures, TIFF, typeHandlers, types, firstBytes, sortNumeric, baseService, PLACEHOLDER_BASE, cssFitValues, $$Image, mimes, $$Picture, componentDataByCssVariable, $$Font, SsrRuntimeFontFileUrlResolver, _astroLogger, _runtimeLogger, assetQueryParams, imageConfig, inferRemoteSize, getImage, fnv1a52, etag, generic_exports, GET, generic___js_exports, page;
var init_generic_DdU7CG9U = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/generic_DdU7CG9U.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_errors_D7mtj974();
    init_remote_NpkQAic();
    init_compiler_Cv_Cl9y0();
    init_console_DgykGsYt();
    level = "info";
    VALID_SUPPORTED_FORMATS = [
      "jpeg",
      "jpg",
      "png",
      "tiff",
      "webp",
      "gif",
      "svg",
      "avif"
    ];
    DEFAULT_OUTPUT_FORMAT = "webp";
    DEFAULT_HASH_PROPS = [
      "src",
      "width",
      "height",
      "format",
      "quality",
      "fit",
      "position",
      "background"
    ];
    DEFAULT_RESOLUTIONS = [
      640,
      750,
      828,
      960,
      1080,
      1280,
      1668,
      1920,
      2048,
      2560,
      3200,
      3840,
      4480,
      5120,
      6016
    ];
    LIMITED_RESOLUTIONS = [
      640,
      750,
      828,
      1080,
      1280,
      1668,
      2048,
      2560
    ];
    getWidths = ({ width, layout, breakpoints = DEFAULT_RESOLUTIONS, originalWidth }) => {
      const smallerThanOriginal = (w4) => !originalWidth || w4 <= originalWidth;
      if (layout === "full-width") return breakpoints.filter(smallerThanOriginal);
      if (!width) return [];
      const doubleWidth = width * 2;
      const maxSize = originalWidth ? Math.min(doubleWidth, originalWidth) : doubleWidth;
      if (layout === "fixed") return originalWidth && width > originalWidth ? [originalWidth] : [width, maxSize];
      if (layout === "constrained") return [
        width,
        doubleWidth,
        ...breakpoints
      ].filter((w4) => w4 <= maxSize).sort((a5, b3) => a5 - b3);
      return [];
    };
    getSizesAttribute = ({ width, layout }) => {
      if (!width || !layout) return;
      switch (layout) {
        case "constrained":
          return `(min-width: ${width}px) ${width}px, 100vw`;
        case "fixed":
          return `${width}px`;
        case "full-width":
          return `100vw`;
        default:
          return;
      }
    };
    DATA_PREFIX = "data:";
    decoder2 = new TextDecoder();
    toUTF8String = (input, start2 = 0, end = input.length) => decoder2.decode(input.slice(start2, end));
    toHexString = (input, start2 = 0, end = input.length) => input.slice(start2, end).reduce((memo2, i5) => memo2 + `0${i5.toString(16)}`.slice(-2), "");
    getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
    readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
    readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
    readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
    readUInt24LE = (input, offset = 0) => {
      const view = getView(input, offset);
      return view.getUint16(0, true) + (view.getUint8(2) << 16);
    };
    readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
    readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
    readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
    readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
    methods = {
      readUInt16BE,
      readUInt16LE,
      readUInt32BE,
      readUInt32LE
    };
    MIN_BOX_HEADER = 8;
    BMP = {
      validate: (input) => toUTF8String(input, 0, 2) === "BM",
      calculate: (input) => ({
        height: Math.abs(readInt32LE(input, 22)),
        width: readUInt32LE(input, 18)
      })
    };
    TYPE_ICON = 1;
    SIZE_HEADER$1 = 6;
    SIZE_IMAGE_ENTRY = 16;
    ICO = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        return readUInt16LE(input, 2) === TYPE_ICON;
      },
      calculate(input) {
        const nbImages = readUInt16LE(input, 4);
        const imageSize = getImageSize$1(input, 0);
        if (nbImages === 1) return imageSize;
        const images = [];
        for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) images.push(getImageSize$1(input, imageIndex));
        return {
          width: imageSize.width,
          height: imageSize.height,
          images
        };
      }
    };
    TYPE_CURSOR = 2;
    CUR = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        return readUInt16LE(input, 2) === TYPE_CURSOR;
      },
      calculate: (input) => ICO.calculate(input)
    };
    DDS = {
      validate: (input) => readUInt32LE(input, 0) === 542327876,
      calculate: (input) => ({
        height: readUInt32LE(input, 12),
        width: readUInt32LE(input, 16)
      })
    };
    gifRegexp = /^GIF8[79]a/;
    GIF = {
      validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
      calculate: (input) => ({
        height: readUInt16LE(input, 8),
        width: readUInt16LE(input, 6)
      })
    };
    brandMap = {
      avif: "avif",
      avis: "avif",
      mif1: "heif",
      msf1: "heif",
      heic: "heic",
      heix: "heic",
      hevc: "heic",
      hevx: "heic"
    };
    HEIF = {
      validate(input) {
        if (toUTF8String(input, 4, 8) !== "ftyp") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) in brandMap;
      },
      calculate(input) {
        const metaBox = findBox(input, "meta", 0);
        const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
        const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
        if (!ipcoBox) throw new TypeError("Invalid HEIF, no ipco box found");
        const type = detectType(input, 8, metaBox.offset);
        const images = [];
        let currentOffset = ipcoBox.offset + 8;
        const ipcoEnd = ipcoBox.offset + ipcoBox.size;
        while (currentOffset < ipcoEnd) {
          const ispeBox = findBox(input, "ispe", currentOffset);
          if (!ispeBox) break;
          if (ispeBox.size < 8) break;
          if (ispeBox.offset + ispeBox.size > ipcoEnd) break;
          const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
          const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
          const clapBox = findBox(input, "clap", currentOffset);
          let width = rawWidth;
          let height = rawHeight;
          if (clapBox && clapBox.offset < ipcoEnd && clapBox.size >= 8) width = rawWidth - readUInt32BE(input, clapBox.offset + 12);
          images.push({
            height,
            width
          });
          const nextOffset = ispeBox.offset + ispeBox.size;
          if (nextOffset <= currentOffset) break;
          currentOffset = nextOffset;
        }
        if (images.length === 0) throw new TypeError("Invalid HEIF, no sizes found");
        return {
          width: images[0].width,
          height: images[0].height,
          type,
          ...images.length > 1 ? { images } : {}
        };
      }
    };
    SIZE_HEADER = 8;
    FILE_LENGTH_OFFSET = 4;
    MIN_ENTRY_LENGTH = 8;
    ENTRY_LENGTH_OFFSET = 4;
    ICON_TYPE_SIZE = {
      ICON: 32,
      "ICN#": 32,
      "icm#": 16,
      icm4: 16,
      icm8: 16,
      "ics#": 16,
      ics4: 16,
      ics8: 16,
      is32: 16,
      s8mk: 16,
      icp4: 16,
      icl4: 32,
      icl8: 32,
      il32: 32,
      l8mk: 32,
      icp5: 32,
      ic11: 32,
      ich4: 48,
      ich8: 48,
      ih32: 48,
      h8mk: 48,
      icp6: 64,
      ic12: 32,
      it32: 128,
      t8mk: 128,
      ic07: 128,
      ic08: 256,
      ic13: 256,
      ic09: 512,
      ic14: 512,
      ic10: 1024
    };
    ICNS = {
      validate: (input) => toUTF8String(input, 0, 4) === "icns",
      calculate(input) {
        const inputLength = input.length;
        const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
        let imageOffset = SIZE_HEADER;
        const images = [];
        while (imageOffset < fileLength && imageOffset < inputLength) {
          if (inputLength - imageOffset < MIN_ENTRY_LENGTH) break;
          const imageHeader = readImageHeader(input, imageOffset);
          const entryLength = imageHeader[1];
          if (entryLength < MIN_ENTRY_LENGTH) break;
          const imageSize = getImageSize(imageHeader[0]);
          if (imageSize.width && imageSize.height) images.push(imageSize);
          const nextOffset = imageOffset + entryLength;
          if (nextOffset <= imageOffset) break;
          imageOffset = nextOffset;
        }
        if (images.length === 0) throw new TypeError("Invalid ICNS, no sizes found");
        return {
          width: images[0].width,
          height: images[0].height,
          ...images.length > 1 ? { images } : {}
        };
      }
    };
    J2C = {
      validate: (input) => readUInt32BE(input, 0) === 4283432785,
      calculate: (input) => ({
        height: readUInt32BE(input, 12),
        width: readUInt32BE(input, 8)
      })
    };
    JP2 = {
      validate(input) {
        if (toUTF8String(input, 4, 8) !== "jP  ") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) === "jp2 ";
      },
      calculate(input) {
        const jp2hBox = findBox(input, "jp2h", 0);
        const ihdrBox = jp2hBox && jp2hBox.size >= 8 && findBox(input, "ihdr", jp2hBox.offset + 8);
        if (ihdrBox && ihdrBox.size >= 8) return {
          height: readUInt32BE(input, ihdrBox.offset + 8),
          width: readUInt32BE(input, ihdrBox.offset + 12)
        };
        throw new TypeError("Unsupported JPEG 2000 format");
      }
    };
    EXIF_MARKER = "45786966";
    APP1_DATA_SIZE_BYTES = 2;
    EXIF_HEADER_BYTES = 6;
    BIG_ENDIAN_BYTE_ALIGN = "4d4d";
    LITTLE_ENDIAN_BYTE_ALIGN = "4949";
    IDF_ENTRY_BYTES = 12;
    JPG = {
      validate: (input) => toHexString(input, 0, 2) === "ffd8",
      calculate(_input) {
        let input = _input.slice(4);
        let orientation;
        let next;
        while (input.length) {
          const i5 = readUInt16BE(input, 0);
          validateInput(input, i5);
          if (input[i5] !== 255) {
            input = input.slice(1);
            continue;
          }
          if (isEXIF(input)) orientation = validateExifBlock(input, i5);
          next = input[i5 + 1];
          if (next === 192 || next === 193 || next === 194) {
            const size = extractSize(input, i5 + 5);
            if (!orientation) return size;
            return {
              height: size.height,
              orientation,
              width: size.width
            };
          }
          input = input.slice(i5 + 2);
        }
        throw new TypeError("Invalid JPG, no size found");
      }
    };
    BitReader = class {
      byteOffset = 2;
      bitOffset = 0;
      input;
      endianness;
      constructor(input, endianness) {
        this.input = input;
        this.endianness = endianness;
      }
      /** Reads a specified number of bits, and move the offset */
      getBits(length = 1) {
        let result = 0;
        let bitsRead = 0;
        while (bitsRead < length) {
          if (this.byteOffset >= this.input.length) throw new Error("Reached end of input");
          const currentByte = this.input[this.byteOffset];
          const bitsLeft = 8 - this.bitOffset;
          const bitsToRead = Math.min(length - bitsRead, bitsLeft);
          if (this.endianness === "little-endian") {
            const mask = (1 << bitsToRead) - 1;
            const bits = currentByte >> this.bitOffset & mask;
            result |= bits << bitsRead;
          } else {
            const bits = (currentByte & (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead) >> 8 - this.bitOffset - bitsToRead;
            result = result << bitsToRead | bits;
          }
          bitsRead += bitsToRead;
          this.bitOffset += bitsToRead;
          if (this.bitOffset === 8) {
            this.byteOffset++;
            this.bitOffset = 0;
          }
        }
        return result;
      }
    };
    JXLStream = {
      validate: (input) => {
        return toHexString(input, 0, 2) === "ff0a";
      },
      calculate(input) {
        const reader = new BitReader(input, "little-endian");
        const isSmallImage = reader.getBits(1) === 1;
        const height = calculateImageDimension(reader, isSmallImage);
        return {
          width: calculateImageWidth(reader, isSmallImage, reader.getBits(3), height),
          height
        };
      }
    };
    JXL = {
      validate: (input) => {
        if (toUTF8String(input, 4, 8) !== "JXL ") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) === "jxl ";
      },
      calculate(input) {
        const codestream = extractCodestream(input);
        if (codestream) return JXLStream.calculate(codestream);
        throw new Error("No codestream found in JXL container");
      }
    };
    KTX = {
      validate: (input) => {
        const signature = toUTF8String(input, 1, 7);
        return ["KTX 11", "KTX 20"].includes(signature);
      },
      calculate: (input) => {
        const type = input[5] === 49 ? "ktx" : "ktx2";
        const offset = type === "ktx" ? 36 : 20;
        return {
          height: readUInt32LE(input, offset + 4),
          width: readUInt32LE(input, offset),
          type
        };
      }
    };
    pngSignature = "PNG\r\n\n";
    pngImageHeaderChunkName = "IHDR";
    pngFriedChunkName = "CgBI";
    PNG = {
      validate(input) {
        if (pngSignature === toUTF8String(input, 1, 8)) {
          let chunkName = toUTF8String(input, 12, 16);
          if (chunkName === pngFriedChunkName) chunkName = toUTF8String(input, 28, 32);
          if (chunkName !== pngImageHeaderChunkName) throw new TypeError("Invalid PNG");
          return true;
        }
        return false;
      },
      calculate(input) {
        if (toUTF8String(input, 12, 16) === pngFriedChunkName) return {
          height: readUInt32BE(input, 36),
          width: readUInt32BE(input, 32)
        };
        return {
          height: readUInt32BE(input, 20),
          width: readUInt32BE(input, 16)
        };
      }
    };
    PNMTypes = {
      P1: "pbm/ascii",
      P2: "pgm/ascii",
      P3: "ppm/ascii",
      P4: "pbm",
      P5: "pgm",
      P6: "ppm",
      P7: "pam",
      PF: "pfm"
    };
    handlers = {
      default: (lines) => {
        let dimensions = [];
        while (lines.length > 0) {
          const line = lines.shift();
          if (line[0] === "#") continue;
          dimensions = line.split(" ");
          break;
        }
        if (dimensions.length === 2) return {
          height: Number.parseInt(dimensions[1], 10),
          width: Number.parseInt(dimensions[0], 10)
        };
        throw new TypeError("Invalid PNM");
      },
      pam: (lines) => {
        const size = {};
        while (lines.length > 0) {
          const line = lines.shift();
          if (line.length > 16 || line.charCodeAt(0) > 128) continue;
          const [key, value] = line.split(" ");
          if (key && value) size[key.toLowerCase()] = Number.parseInt(value, 10);
          if (size.height && size.width) break;
        }
        if (size.height && size.width) return {
          height: size.height,
          width: size.width
        };
        throw new TypeError("Invalid PAM");
      }
    };
    PNM = {
      validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
      calculate(input) {
        const type = PNMTypes[toUTF8String(input, 0, 2)];
        const lines = toUTF8String(input, 3).split(/[\r\n]+/);
        return (handlers[type] || handlers.default)(lines);
      }
    };
    PSD = {
      validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
      calculate: (input) => ({
        height: readUInt32BE(input, 14),
        width: readUInt32BE(input, 18)
      })
    };
    svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
    extractorRegExps = {
      height: /\sheight=(['"])([^%]+?)\1/,
      root: svgReg,
      viewbox: /\sviewBox=(['"])(.+?)\1/i,
      width: /\swidth=(['"])([^%]+?)\1/
    };
    INCH_CM = 2.54;
    units = {
      in: 96,
      cm: 96 / INCH_CM,
      em: 16,
      ex: 8,
      m: 96 / INCH_CM * 100,
      mm: 96 / INCH_CM / 10,
      pc: 96 / 72 / 12,
      pt: 96 / 72,
      px: 1
    };
    unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`);
    SVG = {
      validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
      calculate(input) {
        const root = extractorRegExps.root.exec(toUTF8String(input));
        if (root) {
          const attrs = parseAttributes(root[0]);
          if (attrs.width != null && attrs.height != null) return calculateByDimensions(attrs);
          if (attrs.viewbox) return calculateByViewbox(attrs, attrs.viewbox);
        }
        throw new TypeError("Invalid SVG");
      }
    };
    TGA = {
      validate(input) {
        return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
      },
      calculate(input) {
        return {
          height: readUInt16LE(input, 14),
          width: readUInt16LE(input, 12)
        };
      }
    };
    CONSTANTS = {
      TAG: {
        WIDTH: 256,
        HEIGHT: 257,
        COMPRESSION: 259
      },
      TYPE: {
        SHORT: 3,
        LONG: 4,
        LONG8: 16
      },
      ENTRY_SIZE: {
        STANDARD: 12,
        BIG: 20
      },
      COUNT_SIZE: {
        STANDARD: 2,
        BIG: 8
      }
    };
    signatures = /* @__PURE__ */ new Set([
      "49492a00",
      "4d4d002a",
      "49492b00",
      "4d4d002b"
    ]);
    TIFF = {
      validate: (input) => {
        const signature = toHexString(input, 0, 4);
        return signatures.has(signature);
      },
      calculate(input) {
        const format = determineFormat(input);
        if (format.isBigTiff) validateBigTIFFHeader(input, format.isBigEndian);
        const tags = extractTags(readIFD(input, format), format);
        const info2 = {
          height: tags[CONSTANTS.TAG.HEIGHT],
          width: tags[CONSTANTS.TAG.WIDTH],
          type: format.isBigTiff ? "bigtiff" : "tiff"
        };
        if (tags[CONSTANTS.TAG.COMPRESSION]) info2.compression = tags[CONSTANTS.TAG.COMPRESSION];
        if (!info2.width || !info2.height) throw new TypeError("Invalid Tiff. Missing tags");
        return info2;
      }
    };
    typeHandlers = /* @__PURE__ */ new Map([
      ["bmp", BMP],
      ["cur", CUR],
      ["dds", DDS],
      ["gif", GIF],
      ["heif", HEIF],
      ["icns", ICNS],
      ["ico", ICO],
      ["j2c", J2C],
      ["jp2", JP2],
      ["jpg", JPG],
      ["jxl", JXL],
      ["jxl-stream", JXLStream],
      ["ktx", KTX],
      ["png", PNG],
      ["pnm", PNM],
      ["psd", PSD],
      ["svg", SVG],
      ["tga", TGA],
      ["tiff", TIFF],
      ["webp", {
        validate(input) {
          const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
          const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
          const vp8Header = "VP8" === toUTF8String(input, 12, 15);
          return riffHeader && webpHeader && vp8Header;
        },
        calculate(_input) {
          const chunkHeader = toUTF8String(_input, 12, 16);
          const input = _input.slice(20, 30);
          if (chunkHeader === "VP8X") {
            const extendedHeader = input[0];
            const validStart = (extendedHeader & 192) === 0;
            const validEnd = (extendedHeader & 1) === 0;
            if (validStart && validEnd) return calculateExtended(input);
            throw new TypeError("Invalid WebP");
          }
          if (chunkHeader === "VP8 " && input[0] !== 47) return calculateLossy(input);
          const signature = toHexString(input, 3, 6);
          if (chunkHeader === "VP8L" && signature !== "9d012a") return calculateLossless(input);
          throw new TypeError("Invalid WebP");
        }
      }]
    ]);
    types = Array.from(typeHandlers.keys());
    firstBytes = /* @__PURE__ */ new Map([
      [0, "heif"],
      [56, "psd"],
      [66, "bmp"],
      [68, "dds"],
      [71, "gif"],
      [73, "tiff"],
      [77, "tiff"],
      [82, "webp"],
      [105, "icns"],
      [137, "png"],
      [255, "jpg"]
    ]);
    sortNumeric = (a5, b3) => a5 - b3;
    baseService = {
      propertiesToHash: DEFAULT_HASH_PROPS,
      validateOptions(options) {
        verifyOptions(options);
        if (!options.format) {
          if (isESMImportedImage(options.src)) options.format = resolveDefaultOutputFormat(options.src.format);
          else {
            const inferred = inferSourceFormat(options.src);
            if (inferred) options.format = resolveDefaultOutputFormat(inferred);
          }
        }
        if (options.width) options.width = Math.round(options.width);
        if (options.height) options.height = Math.round(options.height);
        if (options.layout) delete options.layout;
        if (options.fit === "none") delete options.fit;
        return options;
      },
      getHTMLAttributes(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const { src, width, height, format, quality, densities, widths, formats, layout, priority, fit, position, background, ...attributes } = options;
        return {
          ...attributes,
          width: targetWidth,
          height: targetHeight,
          loading: attributes.loading ?? "lazy",
          decoding: attributes.decoding ?? "async"
        };
      },
      getSrcSet(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const aspectRatio = targetWidth / targetHeight;
        const { widths, densities } = options;
        const targetFormat = options.format;
        let transformedWidths = (widths ?? []).sort(sortNumeric);
        let imageWidth = options.width;
        let maxWidth = Number.POSITIVE_INFINITY;
        if (isESMImportedImage(options.src)) {
          imageWidth = options.src.width;
          maxWidth = imageWidth;
          if (transformedWidths.length > 0 && transformedWidths.at(-1) > maxWidth) {
            transformedWidths = transformedWidths.filter((width) => width <= maxWidth);
            transformedWidths.push(maxWidth);
          }
        }
        transformedWidths = Array.from(new Set(transformedWidths));
        const { width: transformWidth, height: transformHeight, ...transformWithoutDimensions } = options;
        let allWidths = [];
        if (densities) {
          const densityValues = densities.map((density) => {
            if (typeof density === "number") return density;
            else return Number.parseFloat(density);
          });
          allWidths = densityValues.sort(sortNumeric).map((density) => Math.round(targetWidth * density)).map((width, index) => ({
            width,
            descriptor: `${densityValues[index]}x`
          }));
        } else if (transformedWidths.length > 0) allWidths = transformedWidths.map((width) => ({
          width,
          descriptor: `${width}w`
        }));
        return allWidths.map(({ width, descriptor }) => {
          const height = Math.round(width / aspectRatio);
          return {
            transform: {
              ...transformWithoutDimensions,
              width,
              height
            },
            descriptor,
            attributes: targetFormat ? { type: `image/${targetFormat}` } : {}
          };
        });
      },
      getURL(options, imageConfig2) {
        const searchParams = new URLSearchParams();
        if (isESMImportedImage(options.src)) searchParams.append("href", options.src.src);
        else if (isRemoteAllowed(options.src, imageConfig2)) searchParams.append("href", options.src);
        else return options.src;
        Object.entries({
          w: "width",
          h: "height",
          q: "quality",
          f: "format",
          fit: "fit",
          position: "position",
          background: "background"
        }).forEach(([param, key]) => {
          options[key] && searchParams.append(param, options[key].toString());
        });
        let url = `${joinPaths("/", imageConfig2.endpoint.route)}?${searchParams}`;
        if (imageConfig2.assetQueryParams) {
          const assetQueryString = imageConfig2.assetQueryParams.toString();
          if (assetQueryString) url += "&" + assetQueryString;
        }
        return url;
      },
      parseURL(url) {
        const params = url.searchParams;
        if (!params.has("href")) return;
        return {
          src: params.get("href"),
          width: params.has("w") ? Number.parseInt(params.get("w")) : void 0,
          height: params.has("h") ? Number.parseInt(params.get("h")) : void 0,
          format: params.has("f") ? params.get("f") : void 0,
          quality: params.get("q"),
          fit: params.get("fit"),
          position: params.get("position") ?? void 0,
          background: params.get("background") ?? void 0
        };
      },
      getRemoteSize(url, imageConfig2) {
        return inferRemoteSize$1(url, imageConfig2);
      }
    };
    PLACEHOLDER_BASE = "astro://placeholder";
    cssFitValues = [
      "fill",
      "contain",
      "cover",
      "scale-down"
    ];
    Function.prototype.toString.call(Object);
    createAstro("https://astro.build");
    $$Image = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Image;
      const props = Astro2.props;
      if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
      if (typeof props.width === "string") props.width = Number.parseInt(props.width);
      if (typeof props.height === "string") props.height = Number.parseInt(props.height);
      if ((props.layout ?? imageConfig.layout ?? "none") !== "none") {
        props.layout ??= imageConfig.layout;
        props.fit ??= imageConfig.objectFit ?? "cover";
        props.position ??= imageConfig.objectPosition ?? "center";
      } else if (imageConfig.objectFit || imageConfig.objectPosition) {
        props.fit ??= imageConfig.objectFit;
        props.position ??= imageConfig.objectPosition;
      }
      const image = await getImage(props);
      const additionalAttributes = {};
      if (image.srcSet.values.length > 0) additionalAttributes.srcset = image.srcSet.attribute;
      const { class: className, ...attributes } = {
        ...additionalAttributes,
        ...image.attributes
      };
      return renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/components/Image.astro", void 0);
    mimes = {
      "3g2": "video/3gpp2",
      "3gp": "video/3gpp",
      "3gpp": "video/3gpp",
      "3mf": "model/3mf",
      "aac": "audio/aac",
      "ac": "application/pkix-attr-cert",
      "adp": "audio/adpcm",
      "adts": "audio/aac",
      "ai": "application/postscript",
      "aml": "application/automationml-aml+xml",
      "amlx": "application/automationml-amlx+zip",
      "amr": "audio/amr",
      "apng": "image/apng",
      "appcache": "text/cache-manifest",
      "appinstaller": "application/appinstaller",
      "appx": "application/appx",
      "appxbundle": "application/appxbundle",
      "asc": "application/pgp-keys",
      "atom": "application/atom+xml",
      "atomcat": "application/atomcat+xml",
      "atomdeleted": "application/atomdeleted+xml",
      "atomsvc": "application/atomsvc+xml",
      "au": "audio/basic",
      "avci": "image/avci",
      "avcs": "image/avcs",
      "avif": "image/avif",
      "aw": "application/applixware",
      "bdoc": "application/bdoc",
      "bin": "application/octet-stream",
      "bmp": "image/bmp",
      "bpk": "application/octet-stream",
      "btf": "image/prs.btif",
      "btif": "image/prs.btif",
      "buffer": "application/octet-stream",
      "ccxml": "application/ccxml+xml",
      "cdfx": "application/cdfx+xml",
      "cdmia": "application/cdmi-capability",
      "cdmic": "application/cdmi-container",
      "cdmid": "application/cdmi-domain",
      "cdmio": "application/cdmi-object",
      "cdmiq": "application/cdmi-queue",
      "cer": "application/pkix-cert",
      "cgm": "image/cgm",
      "cjs": "application/node",
      "class": "application/java-vm",
      "coffee": "text/coffeescript",
      "conf": "text/plain",
      "cpl": "application/cpl+xml",
      "cpt": "application/mac-compactpro",
      "crl": "application/pkix-crl",
      "css": "text/css",
      "csv": "text/csv",
      "cu": "application/cu-seeme",
      "cwl": "application/cwl",
      "cww": "application/prs.cww",
      "davmount": "application/davmount+xml",
      "dbk": "application/docbook+xml",
      "deb": "application/octet-stream",
      "def": "text/plain",
      "deploy": "application/octet-stream",
      "dib": "image/bmp",
      "disposition-notification": "message/disposition-notification",
      "dist": "application/octet-stream",
      "distz": "application/octet-stream",
      "dll": "application/octet-stream",
      "dmg": "application/octet-stream",
      "dms": "application/octet-stream",
      "doc": "application/msword",
      "dot": "application/msword",
      "dpx": "image/dpx",
      "drle": "image/dicom-rle",
      "dsc": "text/prs.lines.tag",
      "dssc": "application/dssc+der",
      "dtd": "application/xml-dtd",
      "dump": "application/octet-stream",
      "dwd": "application/atsc-dwd+xml",
      "ear": "application/java-archive",
      "ecma": "application/ecmascript",
      "elc": "application/octet-stream",
      "emf": "image/emf",
      "eml": "message/rfc822",
      "emma": "application/emma+xml",
      "emotionml": "application/emotionml+xml",
      "eps": "application/postscript",
      "epub": "application/epub+zip",
      "exe": "application/octet-stream",
      "exi": "application/exi",
      "exp": "application/express",
      "exr": "image/aces",
      "ez": "application/andrew-inset",
      "fdf": "application/fdf",
      "fdt": "application/fdt+xml",
      "fits": "image/fits",
      "g3": "image/g3fax",
      "gbr": "application/rpki-ghostbusters",
      "geojson": "application/geo+json",
      "gif": "image/gif",
      "glb": "model/gltf-binary",
      "gltf": "model/gltf+json",
      "gml": "application/gml+xml",
      "gpx": "application/gpx+xml",
      "gram": "application/srgs",
      "grxml": "application/srgs+xml",
      "gxf": "application/gxf",
      "gz": "application/gzip",
      "h261": "video/h261",
      "h263": "video/h263",
      "h264": "video/h264",
      "heic": "image/heic",
      "heics": "image/heic-sequence",
      "heif": "image/heif",
      "heifs": "image/heif-sequence",
      "hej2": "image/hej2k",
      "held": "application/atsc-held+xml",
      "hjson": "application/hjson",
      "hlp": "application/winhlp",
      "hqx": "application/mac-binhex40",
      "hsj2": "image/hsj2",
      "htm": "text/html",
      "html": "text/html",
      "ics": "text/calendar",
      "ief": "image/ief",
      "ifb": "text/calendar",
      "iges": "model/iges",
      "igs": "model/iges",
      "img": "application/octet-stream",
      "in": "text/plain",
      "ini": "text/plain",
      "ink": "application/inkml+xml",
      "inkml": "application/inkml+xml",
      "ipfix": "application/ipfix",
      "iso": "application/octet-stream",
      "its": "application/its+xml",
      "jade": "text/jade",
      "jar": "application/java-archive",
      "jhc": "image/jphc",
      "jls": "image/jls",
      "jp2": "image/jp2",
      "jpe": "image/jpeg",
      "jpeg": "image/jpeg",
      "jpf": "image/jpx",
      "jpg": "image/jpeg",
      "jpg2": "image/jp2",
      "jpgm": "image/jpm",
      "jpgv": "video/jpeg",
      "jph": "image/jph",
      "jpm": "image/jpm",
      "jpx": "image/jpx",
      "js": "text/javascript",
      "json": "application/json",
      "json5": "application/json5",
      "jsonld": "application/ld+json",
      "jsonml": "application/jsonml+json",
      "jsx": "text/jsx",
      "jt": "model/jt",
      "jxl": "image/jxl",
      "jxr": "image/jxr",
      "jxra": "image/jxra",
      "jxrs": "image/jxrs",
      "jxs": "image/jxs",
      "jxsc": "image/jxsc",
      "jxsi": "image/jxsi",
      "jxss": "image/jxss",
      "kar": "audio/midi",
      "ktx": "image/ktx",
      "ktx2": "image/ktx2",
      "less": "text/less",
      "lgr": "application/lgr+xml",
      "list": "text/plain",
      "litcoffee": "text/coffeescript",
      "log": "text/plain",
      "lostxml": "application/lost+xml",
      "lrf": "application/octet-stream",
      "m1v": "video/mpeg",
      "m21": "application/mp21",
      "m2a": "audio/mpeg",
      "m2t": "video/mp2t",
      "m2ts": "video/mp2t",
      "m2v": "video/mpeg",
      "m3a": "audio/mpeg",
      "m4a": "audio/mp4",
      "m4p": "application/mp4",
      "m4s": "video/iso.segment",
      "ma": "application/mathematica",
      "mads": "application/mads+xml",
      "maei": "application/mmt-aei+xml",
      "man": "text/troff",
      "manifest": "text/cache-manifest",
      "map": "application/json",
      "mar": "application/octet-stream",
      "markdown": "text/markdown",
      "mathml": "application/mathml+xml",
      "mb": "application/mathematica",
      "mbox": "application/mbox",
      "md": "text/markdown",
      "mdx": "text/mdx",
      "me": "text/troff",
      "mesh": "model/mesh",
      "meta4": "application/metalink4+xml",
      "metalink": "application/metalink+xml",
      "mets": "application/mets+xml",
      "mft": "application/rpki-manifest",
      "mid": "audio/midi",
      "midi": "audio/midi",
      "mime": "message/rfc822",
      "mj2": "video/mj2",
      "mjp2": "video/mj2",
      "mjs": "text/javascript",
      "mml": "text/mathml",
      "mods": "application/mods+xml",
      "mov": "video/quicktime",
      "mp2": "audio/mpeg",
      "mp21": "application/mp21",
      "mp2a": "audio/mpeg",
      "mp3": "audio/mpeg",
      "mp4": "video/mp4",
      "mp4a": "audio/mp4",
      "mp4s": "application/mp4",
      "mp4v": "video/mp4",
      "mpd": "application/dash+xml",
      "mpe": "video/mpeg",
      "mpeg": "video/mpeg",
      "mpf": "application/media-policy-dataset+xml",
      "mpg": "video/mpeg",
      "mpg4": "video/mp4",
      "mpga": "audio/mpeg",
      "mpp": "application/dash-patch+xml",
      "mrc": "application/marc",
      "mrcx": "application/marcxml+xml",
      "ms": "text/troff",
      "mscml": "application/mediaservercontrol+xml",
      "msh": "model/mesh",
      "msi": "application/octet-stream",
      "msix": "application/msix",
      "msixbundle": "application/msixbundle",
      "msm": "application/octet-stream",
      "msp": "application/octet-stream",
      "mtl": "model/mtl",
      "mts": "video/mp2t",
      "musd": "application/mmt-usd+xml",
      "mxf": "application/mxf",
      "mxmf": "audio/mobile-xmf",
      "mxml": "application/xv+xml",
      "n3": "text/n3",
      "nb": "application/mathematica",
      "nq": "application/n-quads",
      "nt": "application/n-triples",
      "obj": "model/obj",
      "oda": "application/oda",
      "oga": "audio/ogg",
      "ogg": "audio/ogg",
      "ogv": "video/ogg",
      "ogx": "application/ogg",
      "omdoc": "application/omdoc+xml",
      "onepkg": "application/onenote",
      "onetmp": "application/onenote",
      "onetoc": "application/onenote",
      "onetoc2": "application/onenote",
      "opf": "application/oebps-package+xml",
      "opus": "audio/ogg",
      "otf": "font/otf",
      "owl": "application/rdf+xml",
      "oxps": "application/oxps",
      "p10": "application/pkcs10",
      "p7c": "application/pkcs7-mime",
      "p7m": "application/pkcs7-mime",
      "p7s": "application/pkcs7-signature",
      "p8": "application/pkcs8",
      "pdf": "application/pdf",
      "pfr": "application/font-tdpfr",
      "pgp": "application/pgp-encrypted",
      "pkg": "application/octet-stream",
      "pki": "application/pkixcmp",
      "pkipath": "application/pkix-pkipath",
      "pls": "application/pls+xml",
      "png": "image/png",
      "prc": "model/prc",
      "prf": "application/pics-rules",
      "provx": "application/provenance+xml",
      "ps": "application/postscript",
      "pskcxml": "application/pskc+xml",
      "pti": "image/prs.pti",
      "qt": "video/quicktime",
      "raml": "application/raml+yaml",
      "rapd": "application/route-apd+xml",
      "rdf": "application/rdf+xml",
      "relo": "application/p2p-overlay+xml",
      "rif": "application/reginfo+xml",
      "rl": "application/resource-lists+xml",
      "rld": "application/resource-lists-diff+xml",
      "rmi": "audio/midi",
      "rnc": "application/relax-ng-compact-syntax",
      "rng": "application/xml",
      "roa": "application/rpki-roa",
      "roff": "text/troff",
      "rq": "application/sparql-query",
      "rs": "application/rls-services+xml",
      "rsat": "application/atsc-rsat+xml",
      "rsd": "application/rsd+xml",
      "rsheet": "application/urc-ressheet+xml",
      "rss": "application/rss+xml",
      "rtf": "text/rtf",
      "rtx": "text/richtext",
      "rusd": "application/route-usd+xml",
      "s3m": "audio/s3m",
      "sbml": "application/sbml+xml",
      "scq": "application/scvp-cv-request",
      "scs": "application/scvp-cv-response",
      "sdp": "application/sdp",
      "senmlx": "application/senml+xml",
      "sensmlx": "application/sensml+xml",
      "ser": "application/java-serialized-object",
      "setpay": "application/set-payment-initiation",
      "setreg": "application/set-registration-initiation",
      "sgi": "image/sgi",
      "sgm": "text/sgml",
      "sgml": "text/sgml",
      "shex": "text/shex",
      "shf": "application/shf+xml",
      "shtml": "text/html",
      "sieve": "application/sieve",
      "sig": "application/pgp-signature",
      "sil": "audio/silk",
      "silo": "model/mesh",
      "siv": "application/sieve",
      "slim": "text/slim",
      "slm": "text/slim",
      "sls": "application/route-s-tsid+xml",
      "smi": "application/smil+xml",
      "smil": "application/smil+xml",
      "snd": "audio/basic",
      "so": "application/octet-stream",
      "spdx": "text/spdx",
      "spp": "application/scvp-vp-response",
      "spq": "application/scvp-vp-request",
      "spx": "audio/ogg",
      "sql": "application/sql",
      "sru": "application/sru+xml",
      "srx": "application/sparql-results+xml",
      "ssdl": "application/ssdl+xml",
      "ssml": "application/ssml+xml",
      "stk": "application/hyperstudio",
      "stl": "model/stl",
      "stpx": "model/step+xml",
      "stpxz": "model/step-xml+zip",
      "stpz": "model/step+zip",
      "styl": "text/stylus",
      "stylus": "text/stylus",
      "svg": "image/svg+xml",
      "svgz": "image/svg+xml",
      "swidtag": "application/swid+xml",
      "t": "text/troff",
      "t38": "image/t38",
      "td": "application/urc-targetdesc+xml",
      "tei": "application/tei+xml",
      "teicorpus": "application/tei+xml",
      "text": "text/plain",
      "tfi": "application/thraud+xml",
      "tfx": "image/tiff-fx",
      "tif": "image/tiff",
      "tiff": "image/tiff",
      "toml": "application/toml",
      "tr": "text/troff",
      "trig": "application/trig",
      "ts": "video/mp2t",
      "tsd": "application/timestamped-data",
      "tsv": "text/tab-separated-values",
      "ttc": "font/collection",
      "ttf": "font/ttf",
      "ttl": "text/turtle",
      "ttml": "application/ttml+xml",
      "txt": "text/plain",
      "u3d": "model/u3d",
      "u8dsn": "message/global-delivery-status",
      "u8hdr": "message/global-headers",
      "u8mdn": "message/global-disposition-notification",
      "u8msg": "message/global",
      "ubj": "application/ubjson",
      "uri": "text/uri-list",
      "uris": "text/uri-list",
      "urls": "text/uri-list",
      "vcard": "text/vcard",
      "vrml": "model/vrml",
      "vtt": "text/vtt",
      "vxml": "application/voicexml+xml",
      "war": "application/java-archive",
      "wasm": "application/wasm",
      "wav": "audio/wav",
      "weba": "audio/webm",
      "webm": "video/webm",
      "webmanifest": "application/manifest+json",
      "webp": "image/webp",
      "wgsl": "text/wgsl",
      "wgt": "application/widget",
      "wif": "application/watcherinfo+xml",
      "wmf": "image/wmf",
      "woff": "font/woff",
      "woff2": "font/woff2",
      "wrl": "model/vrml",
      "wsdl": "application/wsdl+xml",
      "wspolicy": "application/wspolicy+xml",
      "x3d": "model/x3d+xml",
      "x3db": "model/x3d+fastinfoset",
      "x3dbz": "model/x3d+binary",
      "x3dv": "model/x3d-vrml",
      "x3dvz": "model/x3d+vrml",
      "x3dz": "model/x3d+xml",
      "xaml": "application/xaml+xml",
      "xav": "application/xcap-att+xml",
      "xca": "application/xcap-caps+xml",
      "xcs": "application/calendar+xml",
      "xdf": "application/xcap-diff+xml",
      "xdssc": "application/dssc+xml",
      "xel": "application/xcap-el+xml",
      "xenc": "application/xenc+xml",
      "xer": "application/patch-ops-error+xml",
      "xfdf": "application/xfdf",
      "xht": "application/xhtml+xml",
      "xhtml": "application/xhtml+xml",
      "xhvml": "application/xv+xml",
      "xlf": "application/xliff+xml",
      "xm": "audio/xm",
      "xml": "text/xml",
      "xns": "application/xcap-ns+xml",
      "xop": "application/xop+xml",
      "xpl": "application/xproc+xml",
      "xsd": "application/xml",
      "xsf": "application/prs.xsf+xml",
      "xsl": "application/xml",
      "xslt": "application/xml",
      "xspf": "application/xspf+xml",
      "xvm": "application/xv+xml",
      "xvml": "application/xv+xml",
      "yaml": "text/yaml",
      "yang": "application/yang",
      "yin": "application/yin+xml",
      "yml": "text/yaml",
      "zip": "application/zip"
    };
    createAstro("https://astro.build");
    $$Picture = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Picture;
      const defaultFormats = ["webp"];
      const defaultFallbackFormat = "png";
      const specialFormatsFallback = [
        "gif",
        "svg",
        "jpg",
        "jpeg"
      ];
      const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
      if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
      const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
      if (scopedStyleClass) {
        if (pictureAttributes.class) pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
        else pictureAttributes.class = scopedStyleClass;
      }
      const useResponsive = (props.layout ?? imageConfig.layout ?? "none") !== "none";
      if (useResponsive) {
        props.layout ??= imageConfig.layout;
        props.fit ??= imageConfig.objectFit ?? "cover";
        props.position ??= imageConfig.objectPosition ?? "center";
      } else if (imageConfig.objectFit || imageConfig.objectPosition) {
        props.fit ??= imageConfig.objectFit;
        props.position ??= imageConfig.objectPosition;
      }
      for (const key in props) if (key.startsWith("data-astro-cid")) pictureAttributes[key] = props[key];
      const originalSrc = await resolveSrc(props.src);
      if ("inferSize" in props && props.inferSize && isRemoteImage(originalSrc)) {
        const remoteSize = await inferRemoteSize(originalSrc);
        delete props.inferSize;
        props.width ??= remoteSize.width;
        props.height ??= remoteSize.height;
      }
      const optimizedImages = await Promise.all(formats.map(async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })));
      const clonedSrc = isESMImportedImage(originalSrc) ? originalSrc.clone ?? originalSrc : originalSrc;
      let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
      if (!fallbackFormat && isESMImportedImage(clonedSrc) && specialFormatsFallback.includes(clonedSrc.format)) resultFallbackFormat = clonedSrc.format;
      const fallbackImage = await getImage({
        ...props,
        format: resultFallbackFormat,
        widths: props.widths,
        densities: props.densities
      });
      const imgAdditionalAttributes = {};
      const sourceAdditionalAttributes = {};
      if (props.sizes) sourceAdditionalAttributes.sizes = props.sizes;
      if (fallbackImage.srcSet.values.length > 0) imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
      const { class: className, ...attributes } = {
        ...imgAdditionalAttributes,
        ...fallbackImage.attributes
      };
      return renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(pictureAttributes)}>${Object.entries(optimizedImages).map(([_4, image]) => {
        const srcsetAttribute = props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
        return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
      })}<img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}></picture>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/components/Picture.astro", void 0);
    componentDataByCssVariable = /* @__PURE__ */ new Map([]);
    createAstro("https://astro.build");
    $$Font = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Font;
      const { cssVariable, preload = false } = Astro.props;
      const data = componentDataByCssVariable.get(cssVariable);
      if (!data) throw new AstroError({
        ...FontFamilyNotFound,
        message: FontFamilyNotFound.message(cssVariable)
      });
      const filteredPreloadData = filterPreloads(data.preloads, preload);
      return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/components/Font.astro", void 0);
    SsrRuntimeFontFileUrlResolver = class {
      #urls;
      constructor({ urls }) {
        this.#urls = urls;
      }
      resolve(url, requestUrl) {
        if (!this.#urls.has(url)) return null;
        if (!url.startsWith("/")) return url;
        if (!requestUrl) throw new AstroError(MissingGetFontFileRequestUrl);
        return `${requestUrl.origin}${url}`;
      }
    };
    new SsrRuntimeFontFileUrlResolver({ urls: /* @__PURE__ */ new Set([]) });
    _astroLogger = createConsoleLogger({ level });
    _runtimeLogger = {
      info: (message) => _astroLogger.info(null, message),
      warn: (message) => _astroLogger.warn(null, message),
      error: (message) => _astroLogger.error(null, message)
    };
    assetQueryParams = void 0;
    imageConfig = {
      "endpoint": { "route": "/_image" },
      "service": {
        "entrypoint": "astro/assets/services/noop",
        "config": {}
      },
      "dangerouslyProcessSVG": false,
      "domains": [],
      "remotePatterns": [],
      "responsiveStyles": false
    };
    Object.defineProperty(imageConfig, "assetQueryParams", {
      value: assetQueryParams,
      enumerable: false,
      configurable: true
    });
    inferRemoteSize = async (url) => {
      return (await getConfiguredImageService()).getRemoteSize?.(url, imageConfig, _runtimeLogger) ?? inferRemoteSize$1(url, imageConfig);
    };
    getImage = async (options) => await getImage$1(options, imageConfig, _runtimeLogger);
    fnv1a52 = (str) => {
      const len = str.length;
      let i5 = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t22 = 0, v22 = 40164, t32 = 0, v32 = 52210;
      while (i5 < len) {
        v0 ^= str.charCodeAt(i5++);
        t0 = v0 * 435;
        t1 = v1 * 435;
        t22 = v22 * 435;
        t32 = v32 * 435;
        t22 += v0 << 8;
        t32 += v1 << 8;
        t1 += t0 >>> 16;
        v0 = t0 & 65535;
        t22 += t1 >>> 16;
        v1 = t1 & 65535;
        v32 = t32 + (t22 >>> 16) & 65535;
        v22 = t22 & 65535;
      }
      return (v32 & 15) * 281474976710656 + v22 * 4294967296 + v1 * 65536 + (v0 ^ v32 >> 4);
    };
    etag = (payload, weak = false) => {
      return (weak ? 'W/"' : '"') + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
    };
    generic_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
    GET = async ({ request, logger }) => {
      try {
        const imageService = await getConfiguredImageService();
        if (!("transform" in imageService)) throw new Error("Configured image service is not a local service");
        const url = new URL(request.url);
        const transform2 = await imageService.parseURL(url, imageConfig, logger);
        if (!transform2?.src) throw new Error("Incorrect transform returned by `parseURL`");
        let inputBuffer = void 0;
        const isRemoteImage2 = isRemotePath(transform2.src);
        if (isRemoteImage2 && isRemoteAllowed(transform2.src, imageConfig) === false) return new Response("Forbidden", { status: 403 });
        const sourceUrl = new URL(transform2.src, url.origin);
        if (!isRemoteImage2 && sourceUrl.origin !== url.origin) return new Response("Forbidden", { status: 403 });
        inputBuffer = await loadImage(sourceUrl, isRemoteImage2 ? new Headers() : request.headers, imageConfig, isRemoteImage2);
        if (!inputBuffer) return new Response("Not Found", { status: 404 });
        const { data, format } = await imageService.transform(new Uint8Array(inputBuffer), transform2, imageConfig, logger);
        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": lookup(format) ?? `image/${format}`,
            "Cache-Control": "public, max-age=31536000",
            ETag: etag(data.toString()),
            Date: (/* @__PURE__ */ new Date()).toUTCString()
          }
        });
      } catch (err) {
        logger.error(`Could not process image request: ${err}`);
        return new Response("Internal Server Error", { status: 500 });
      }
    };
    generic___js_exports = /* @__PURE__ */ __exportAll({ page: () => page });
    page = () => generic_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/BaseLayout_Cs9QTFGi.mjs
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) content = `<script type="module">${inlined}</script>`;
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({
    type: "script",
    id,
    content
  });
}
var $$MainHead, iconPaths, $$Icon, $$ThemeToggle, $$Nav, $$Footer, $$BaseLayout;
var init_BaseLayout_Cs9QTFGi = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/BaseLayout_Cs9QTFGi.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    createAstro("https://astro.build");
    $$MainHead = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$MainHead;
      const { title = "Action Delay API", description = "Action Delay API" } = Astro.props;
      return renderTemplate`<meta charset="UTF-8"><meta name="description" property="og:description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!--  
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400&family=Rubik:wght@500;600&display=swap"
	rel="stylesheet"
/>
--><script>
	// This code is inlined in the head to make dark mode instant & blocking.
	const getThemePreference = () => {
		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
			return localStorage.getItem('theme');
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};
	const isDark = getThemePreference() === 'dark';
	document.documentElement.classList[isDark ? 'add' : 'remove']('theme-dark');

	if (typeof localStorage !== 'undefined') {
		// Watch the document element and persist user preference when it changes.
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains('theme-dark');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	}
<\/script>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/MainHead.astro", void 0);
    iconPaths = {
      "terminal-window": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m80 96 40 32-40 32m56 0h40"/><rect width="192" height="160" x="32" y="48" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16.97" rx="8.5"/>`,
      trophy: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M56 56v55.1c0 39.7 31.8 72.6 71.5 72.9a72 72 0 0 0 72.5-72V56a8 8 0 0 0-8-8H64a8 8 0 0 0-8 8Zm40 168h64m-32-40v40"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M198.2 128h9.8a32 32 0 0 0 32-32V80a8 8 0 0 0-8-8h-32M58 128H47.9a32 32 0 0 1-32-32V80a8 8 0 0 1 8-8h32"/>`,
      strategy: `<circle cx="68" cy="188" r="28" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m40 72 40 40m0-40-40 40m136 56 40 40m0-40-40 40M136 80V40h40"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m136 40 16 16c40 40 8 88-24 96"/>`,
      "paper-plane-tilt": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M210.3 35.9 23.9 88.4a8 8 0 0 0-1.2 15l85.6 40.5a7.8 7.8 0 0 1 3.8 3.8l40.5 85.6a8 8 0 0 0 15-1.2l52.5-186.4a7.9 7.9 0 0 0-9.8-9.8Zm-99.4 109.2 45.2-45.2"/>`,
      "arrow-right": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176m-72-72 72 72-72 72"/>`,
      "arrow-left": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128H40m72-72-72 72 72 72"/>`,
      code: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m64 88-48 40 48 40m128-80 48 40-48 40M160 40 96 216"/>`,
      "microphone-stage": `<circle cx="168" cy="88" r="64" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m213.3 133.3-90.6-90.6M100 156l-12 12m16.8-70.1L28.1 202.5a7.9 7.9 0 0 0 .8 10.4l14.2 14.2a7.9 7.9 0 0 0 10.4.8l104.6-76.7"/>`,
      "pencil-line": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M96 216H48a8 8 0 0 1-8-8v-44.7a7.9 7.9 0 0 1 2.3-5.6l120-120a8 8 0 0 1 11.4 0l44.6 44.6a8 8 0 0 1 0 11.4Zm40-152 56 56"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 216H96l-55.5-55.5M164 92l-96 96"/>`,
      "rocket-launch": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M94.1 184.6c-11.4 33.9-56.6 33.9-56.6 33.9s0-45.2 33.9-56.6m124.5-56.5L128 173.3 82.7 128l67.9-67.9C176.3 34.4 202 34.7 213 36.3a7.8 7.8 0 0 1 6.7 6.7c1.6 11 1.9 36.7-23.8 62.4Z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M184.6 116.7v64.6a8 8 0 0 1-2.4 5.6l-32.3 32.4a8 8 0 0 1-13.5-4.1l-8.4-41.9m11.3-101.9H74.7a8 8 0 0 0-5.6 2.4l-32.4 32.3a8 8 0 0 0 4.1 13.5l41.9 8.4"/>`,
      list: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176M40 64h176M40 192h176"/>`,
      heart: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 216S28 160 28 92a52 52 0 0 1 100-20h0a52 52 0 0 1 100 20c0 68-100 124-100 124Z"/>`,
      "moon-stars": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 112V64m24 24h-48m-24-64v32m16-16h-32m65 113A92 92 0 0 1 103 39h0a92 92 0 1 0 114 114Z"/>`,
      sun: `<circle cx="128" cy="128" r="60" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 36V16M63 63 49 49m-13 79H16m47 65-14 14m79 13v20m65-47 14 14m13-79h20m-47-65 14-14"/>`,
      "twitter-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 88c0-22 18.5-40.3 40.5-40a40 40 0 0 1 36.2 24H240l-32.3 32.3A127.9 127.9 0 0 1 80 224c-32 0-40-12-40-12s32-12 48-36c0 0-64-32-48-120 0 0 40 40 88 48Z"/>`,
      "codepen-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m232 101-104 59-104-59 100.1-56.8a8.3 8.3 0 0 1 7.8 0Z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m232 165-100.1 56.8a8.3 8.3 0 0 1-7.8 0L24 165l104-59Zm0-64v64M24 101v64m104-5v62.8m0-179.6V106"/>`,
      "github-logo": `<g stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke-width="14.7" d="M55.7 167.2c13.9 1 21.3 13.1 22.2 14.6 4.2 7.2 10.4 9.6 18.3 7.1l1.1-3.4a60.3 60.3 0 0 1-25.8-11.9c-12-10.1-18-25.6-18-46.3"/><path fill="none" stroke-width="16" d="M61.4 205.1a24.5 24.5 0 0 1-3-6.1c-3.2-7.9-7.1-10.6-7.8-11.1l-1-.6c-2.4-1.6-9.5-6.5-7.2-13.9 1.4-4.5 6-7.2 12.3-7.2h.8c4 .3 7.6 1.5 10.7 3.2-9.1-10.1-13.6-24.3-13.6-42.3 0-11.3 3.5-21.7 10.1-30.4A46.7 46.7 0 0 1 65 67.3a8.3 8.3 0 0 1 5-4.7c2.8-.9 13.3-2.7 33.2 9.9a105 105 0 0 1 50.5 0c19.9-12.6 30.4-10.8 33.2-9.9 2.3.7 4.1 2.4 5 4.7 5 12.7 4 23.2 2.6 29.4 6.7 8.7 10 18.9 10 30.4 0 42.6-25.8 54.7-43.6 58.7 1.4 4.1 2.2 8.8 2.2 13.7l-.1 23.4v2.3"/><path fill="none" stroke-width="16" d="M160.9 185.7c1.4 4.1 2.2 8.8 2.2 13.7l-.1 23.4v2.3A98.6 98.6 0 1 0 61.4 205c-1.4-2.1-11.3-17.5-11.8-17.8-2.4-1.6-9.5-6.5-7.2-13.9 1.4-4.5 6-7.2 12.3-7.2h.8c4 .3 7.6 1.5 10.7 3.2-9.1-10.1-13.6-24.3-13.6-42.3 0-11.3 3.5-21.7 10.1-30.4A46.4 46.4 0 0 1 65 67.3a8.3 8.3 0 0 1 5-4.7c2.8-.9 13.3-2.7 33.2 9.9a105 105 0 0 1 50.5 0c19.9-12.6 30.4-10.8 33.2-9.9 2.3.7 4.1 2.4 5 4.7 5 12.7 4 23.2 2.6 29.4 6.7 8.7 10 18.9 10 30.4.1 42.6-25.8 54.7-43.6 58.6z"/><path fill="none" stroke-width="18.7" d="m170.1 203.3 17.3-12 17.2-18.7 9.5-26.6v-27.9l-9.5-27.5" /><path fill="none" stroke-width="22.7" d="m92.1 57.3 23.3-4.6 18.7-1.4 29.3 5.4m-110 32.6-8 16-4 21.4.6 20.3 3.4 13" /><path fill="none" stroke-width="13.3" d="M28.8 133a100 100 0 0 0 66.9 94.4v-8.7c-22.4 1.8-33-11.5-35.6-19.8-3.4-8.6-7.8-11.4-8.5-11.8"/></g>`,
      "twitch-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M165 200h-42a8 8 0 0 0-5 2l-46 38v-40H48a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v108a8 8 0 0 1-3 6l-43 36a8 8 0 0 1-5 2Zm3-112v48m-48-48v48"/>`,
      "youtube-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m160 128-48-32v64l48-32z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M24 128c0 30 3 47 5 56a16 16 0 0 0 10 11c34 13 89 13 89 13s56 0 89-13a16 16 0 0 0 10-11c2-9 5-26 5-56s-3-47-5-56a16 16 0 0 0-10-11c-33-13-89-13-89-13s-55 0-89 13a16 16 0 0 0-10 11c-2 9-5 26-5 56Z"/>`,
      "dribbble-logo": `<circle cx="128" cy="128" r="96" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M71 205a160 160 0 0 1 137-77l16 1m-36-76a160 160 0 0 1-124 59 165 165 0 0 1-30-3"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M86 42a161 161 0 0 1 74 177"/>`,
      "discord-logo": `<circle stroke="none" cx="96" cy="144" r="12"/><circle stroke="none" cx="160" cy="144" r="12"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M74 80a175 175 0 0 1 54-8 175 175 0 0 1 54 8m0 96a175 175 0 0 1-54 8 175 175 0 0 1-54-8"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m155 182 12 24a8 8 0 0 0 9 4c25-6 46-16 61-30a8 8 0 0 0 3-8L206 59a8 8 0 0 0-5-5 176 176 0 0 0-30-9 8 8 0 0 0-9 5l-8 24m-53 108-12 24a8 8 0 0 1-9 4c-25-6-46-16-61-30a8 8 0 0 1-3-8L50 59a8 8 0 0 1 5-5 176 176 0 0 1 30-9 8 8 0 0 1 9 5l8 24"/>`,
      "linkedin-logo": `<rect width="184" height="184" x="36" y="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="8"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M120 112v64m-32-64v64m32-36a28 28 0 0 1 56 0v36"/><circle stroke="none" cx="88" cy="80" r="12"/>`,
      "instagram-logo": `<circle cx="128" cy="128" r="40" fill="none" stroke-miterlimit="10" stroke-width="16"/><rect width="184" height="184" x="36" y="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="48"/><circle cx="180" cy="76" r="12" stroke="none" />`,
      "tiktok-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M168 106a96 96 0 0 0 56 18V84a56 56 0 0 1-56-56h-40v128a28 28 0 1 1-40-25V89a68 68 0 1 0 80 67Z"/>`
    };
    createAstro("https://astro.build");
    $$Icon = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Icon;
      const { color = "currentcolor", gradient, icon, size } = Astro.props;
      const iconPath = iconPaths[icon];
      const attrs = {};
      if (size) attrs.style = {
        "--size": size,
        "display": "unset"
      };
      else attrs.style = { "display": "unset" };
      const gradientId = "icon-gradient-" + Math.round(Math.random() * 1e13).toString(36);
      return renderTemplate`${maybeRenderHead($$result)}<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256" aria-hidden="true"${addAttribute(gradient ? `url(#${gradientId})` : color, "stroke")}${addAttribute(gradient ? `url(#${gradientId})` : color, "fill")}${spreadAttributes(attrs, void 0, { "class": "astro-ccg5yoga" })} data-astro-cid-ccg5yoga><g data-astro-cid-ccg5yoga>${unescapeHTML(iconPath)}</g>${gradient && renderTemplate`<linearGradient${addAttribute(gradientId, "id")} x1="23" x2="235" y1="43" y2="202" gradientUnits="userSpaceOnUse" data-astro-cid-ccg5yoga><stop stop-color="var(--gradient-stop-1)" data-astro-cid-ccg5yoga></stop><stop offset=".5" stop-color="var(--gradient-stop-2)" data-astro-cid-ccg5yoga></stop><stop offset="1" stop-color="var(--gradient-stop-3)" data-astro-cid-ccg5yoga></stop></linearGradient>`}</svg>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Icon.astro", void 0);
    $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "theme-toggle", "theme-toggle", { "data-astro-cid-l6lhmie6": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<button data-astro-cid-l6lhmie6><span class="sr-only" data-astro-cid-l6lhmie6>Dark theme</span><span class="icon light" data-astro-cid-l6lhmie6>${renderComponent($$result2, "Icon", $$Icon, {
        "icon": "sun",
        "data-astro-cid-l6lhmie6": true
      })}</span><span class="icon dark" data-astro-cid-l6lhmie6>${renderComponent($$result2, "Icon", $$Icon, {
        "icon": "moon-stars",
        "data-astro-cid-l6lhmie6": true
      })}</span></button>` })}${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro", void 0);
    createAstro("https://astro.build");
    $$Nav = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Nav;
      const textLinks = [
        {
          label: "Bunny Status",
          href: "/"
        },
        {
          label: "Bunny Delay",
          href: "/delay/"
        },
        {
          label: "Bunny Performance",
          href: "/perf/"
        },
        {
          label: "Locations",
          href: "/locations/"
        },
        {
          label: "About",
          href: "/about/"
        }
      ];
      const iconLinks = [{
        label: "GitHub",
        href: "https://github.com/Tyler-OBrien/Action-Delay-API",
        icon: "github-logo"
      }];
      return renderTemplate`${maybeRenderHead($$result)}<nav data-astro-cid-wpvy4v7s><div class="menu-header" data-astro-cid-wpvy4v7s><a href="/" class="site-title" data-astro-cid-wpvy4v7s><img src="/favicon-animated.svg" style="width: 4.0em" data-astro-cid-wpvy4v7s>Action-Delay-API</a>${renderComponent($$result, "menu-button", "menu-button", { "data-astro-cid-wpvy4v7s": true }, { "default": ($$result2) => renderTemplate`<template data-astro-cid-wpvy4v7s>${templateEnter($$result2)}<button class="menu-button" aria-expanded="false" data-astro-cid-wpvy4v7s><span class="sr-only" data-astro-cid-wpvy4v7s>Menu</span>${renderComponent($$result2, "Icon", $$Icon, {
        "icon": "list",
        "data-astro-cid-wpvy4v7s": true
      })}</button>${templateExit($$result2)}</template>` })}</div><noscript><ul class="nav-items" data-astro-cid-wpvy4v7s>${textLinks.map(({ label, href }) => renderTemplate`<li data-astro-cid-wpvy4v7s><a${addAttribute(Astro.url.pathname === href, "aria-current")}${addAttribute(["link", { active: Astro.url.pathname === href || href !== "/" && Astro.url.pathname.startsWith(href) }], "class:list")}${addAttribute(href, "href")} data-astro-cid-wpvy4v7s>${label}</a></li>`)}</ul></noscript><noscript><div class="menu-footer" data-astro-cid-wpvy4v7s><div class="socials" data-astro-cid-wpvy4v7s>${iconLinks.map(({ href, icon, label }) => renderTemplate`<a${addAttribute(href, "href")} class="social" data-astro-cid-wpvy4v7s><span class="sr-only" data-astro-cid-wpvy4v7s>${label}</span>${renderComponent($$result, "Icon", $$Icon, {
        "icon": icon,
        "data-astro-cid-wpvy4v7s": true
      })}</a>`)}</div></div></noscript><div id="menu-content" hidden data-astro-cid-wpvy4v7s><ul class="nav-items" data-astro-cid-wpvy4v7s>${textLinks.map(({ label, href }) => renderTemplate`<li data-astro-cid-wpvy4v7s><a${addAttribute(Astro.url.pathname === href, "aria-current")}${addAttribute(["link", { active: Astro.url.pathname === href || href !== "/" && Astro.url.pathname.startsWith(href) }], "class:list")}${addAttribute(href, "href")} data-astro-cid-wpvy4v7s>${label}</a></li>`)}</ul><div class="menu-footer" data-astro-cid-wpvy4v7s><div class="socials" data-astro-cid-wpvy4v7s>${iconLinks.map(({ href, icon, label }) => renderTemplate`<a${addAttribute(href, "href")} class="social" data-astro-cid-wpvy4v7s><span class="sr-only" data-astro-cid-wpvy4v7s>${label}</span>${renderComponent($$result, "Icon", $$Icon, {
        "icon": icon,
        "data-astro-cid-wpvy4v7s": true
      })}</a>`)}</div><div class="theme-toggle" data-astro-cid-wpvy4v7s>${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-wpvy4v7s": true })}</div></div></div></nav>${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro", void 0);
    $$Footer = createComponent(($$result, $$props, $$slots) => {
      (/* @__PURE__ */ new Date()).getFullYear();
      return renderTemplate`${maybeRenderHead($$result)}<footer data-astro-cid-jo6i4kqk><div class="group" data-astro-cid-jo6i4kqk><p data-astro-cid-jo6i4kqk>Made With <a href="https://astro.build/" data-astro-cid-jo6i4kqk>Astro</a>${renderComponent($$result, "Icon", $$Icon, {
        "icon": "rocket-launch",
        "size": "1.2em",
        "data-astro-cid-jo6i4kqk": true
      })}</p></div><p class="socials" data-astro-cid-jo6i4kqk><a href="https://github.com/Tyler-OBrien/Action-Delay-API" data-astro-cid-jo6i4kqk> GitHub</a></p></footer>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Footer.astro", void 0);
    createAstro("https://astro.build");
    $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$BaseLayout;
      const { title, description } = Astro.props;
      return renderTemplate`<html lang="en" data-astro-cid-z4jru4n3><head>${renderComponent($$result, "MainHead", $$MainHead, {
        "title": title,
        "description": description,
        "data-astro-cid-z4jru4n3": true
      })}${renderHead($$result)}</head><body data-astro-cid-z4jru4n3><div class="stack backgrounds" data-astro-cid-z4jru4n3>${renderComponent($$result, "Nav", $$Nav, { "data-astro-cid-z4jru4n3": true })}${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-z4jru4n3": true })}</div>${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro", void 0);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/Hero_C_IngQTh.mjs
var $$Hero;
var init_Hero_C_IngQTh = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/Hero_C_IngQTh.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    createAstro("https://astro.build");
    $$Hero = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Hero;
      const { align = "center", tagline, title } = Astro.props;
      return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["hero stack gap-4", align], "class:list")} data-astro-cid-ge2uvauf><div class="stack gap-2" data-astro-cid-ge2uvauf><h1 class="title" data-astro-cid-ge2uvauf>${title}</h1>${tagline && renderTemplate`<p class="tagline" data-astro-cid-ge2uvauf>${tagline}</p>`}</div>${renderSlot($$result, $$slots["default"])}</div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Hero.astro", void 0);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/404_1mfDJ-7q.mjs
var mfDJ_7q_exports = {};
__export(mfDJ_7q_exports, {
  page: () => page2
});
var _404_exports, $$404, $$file, $$url, page2;
var init_mfDJ_7q = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/404_1mfDJ-7q.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    _404_exports = /* @__PURE__ */ __exportAll({
      default: () => $$404,
      file: () => $$file,
      url: () => $$url
    });
    $$404 = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Not Found",
        "description": "404 Error \u2014 this page was not found"
      }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Page Not Found",
        "tagline": "Not found"
      })}` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro", void 0);
    $$file = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro";
    $$url = "/404";
    page2 = () => _404_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/about_OFiu2w6j.mjs
var about_OFiu2w6j_exports = {};
__export(about_OFiu2w6j_exports, {
  page: () => page3
});
var about_exports, $$About, $$file2, $$url2, page3;
var init_about_OFiu2w6j = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/about_OFiu2w6j.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    about_exports = /* @__PURE__ */ __exportAll({
      default: () => $$About,
      file: () => $$file2,
      url: () => $$url2
    });
    $$About = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "About | Action Delay API",
        "description": "About Action Delay API",
        "data-astro-cid-ta2fbyqs": true
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20" data-astro-cid-ta2fbyqs><main class="wrapper about" data-astro-cid-ta2fbyqs>${renderComponent($$result2, "Hero", $$Hero, {
        "title": "About",
        "tagline": "More about Action-Delay-API.",
        "data-astro-cid-ta2fbyqs": true
      }, {})}<section data-astro-cid-ta2fbyqs><h2 class="section-title" data-astro-cid-ta2fbyqs>Overview</h2><div class="content" data-astro-cid-ta2fbyqs><p data-astro-cid-ta2fbyqs>This project monitors delay of various Bunny updates/operations, and has also expanded into generic performance monitoring, using 40+ remote <a href="https://api.bunny.chaika.me/v2/locations" data-astro-cid-ta2fbyqs>locations</a>.</p></div></section><section data-astro-cid-ta2fbyqs><h2 class="section-title" data-astro-cid-ta2fbyqs>Job Types</h2><div class="content" data-astro-cid-ta2fbyqs><p data-astro-cid-ta2fbyqs>For various delay jobs, such as updating a DNS Record, or updating an Edge Rule, we perform the update via the Bunny API and then rapidly check via 40 locations when the change is visible on edge. When at least half see the change, we mark the job complete.<br data-astro-cid-ta2fbyqs><br data-astro-cid-ta2fbyqs>Additionally, There is various performance jobs comparing different cloud platforms and services.<br data-astro-cid-ta2fbyqs><br data-astro-cid-ta2fbyqs>Please note that none of these are designed to be perfect benchmarks. Delay Jobs focus on showing issues with update propagation and relative delay if you had done the same action at the same time, how long it'd take for you to see the update on edge.<br data-astro-cid-ta2fbyqs><br data-astro-cid-ta2fbyqs>For performance jobs, a greater care is taken in accuracy but is still hard to guarantee perfect routing in all cases. Most of these locations were handpicked for low latency to global services (only a few ms max) and all are in data centers.<br data-astro-cid-ta2fbyqs><br data-astro-cid-ta2fbyqs></p></div></section><section data-astro-cid-ta2fbyqs><h2 class="section-title" data-astro-cid-ta2fbyqs>Stats</h2><div class="content" data-astro-cid-ta2fbyqs><p data-astro-cid-ta2fbyqs>9 Million+ DNS and HTTP Requests from all nodes per day to perform jobs, with over 400k unique per location delay job results daily.<br data-astro-cid-ta2fbyqs><br data-astro-cid-ta2fbyqs>All results stored in ClickHouse with no sampling, and status live updated, leveraging Postgres as well.</p></div></section><!-- 
			<section>
				<h2 class="section-title">Education</h2>
				<div class="content">
					<p>Corporis voluptates tenetur laudantium.</p>
				</div>
			</section>
			<section>
				<h2 class="section-title">Skills</h2>
				<div class="content">
					<p>officia unde omnis</p>
				</div>
			</section>
			--></main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro", void 0);
    $$file2 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro";
    $$url2 = "/about";
    page3 = () => about_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/overview_DSHxjtA8.mjs
var overview_DSHxjtA8_exports = {};
__export(overview_DSHxjtA8_exports, {
  page: () => page4
});
var overview_exports, $$Overview, $$file3, $$url3, page4;
var init_overview_DSHxjtA8 = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/overview_DSHxjtA8.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    overview_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Overview,
      file: () => $$file3,
      url: () => $$url3
    });
    $$Overview = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Bunny Delay Monitoring",
        "description": "See Bunny Delay Monitoring Jobs"
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20"><main class="wrapper stack gap-8">${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Bunny Delay Jobs",
        "tagline": "See Bunny Delay Monitoring Jobs",
        "align": "start"
      }, { "default": ($$result3) => renderTemplate`<a href="/delay">Delay Jobs</a>` })}${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": "/v2/jobs/analytics/type/BunnyDelay",
        "label": "Overall Bunny Propagation Delay",
        "options": [
          "MedianRunLength",
          "AvgRunLength",
          "MinRunLength",
          "MaxRunLength"
        ],
        "defaultOption": "MedianRunLength",
        "client:only": "preact",
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `/v2/jobs/analytics/type/BunnyDelay`,
        "label": `Overall Bunny Delay API Response Time`,
        "options": [
          "AvgApiResponseLatency",
          "MedianApiResponseLatency",
          "MinApiResponseLatency",
          "MaxApiResponseLatency"
        ],
        "client:only": "preact",
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}${renderComponent($$result2, "ErrorGraph", null, {
        "endpoint": `/v2/jobs/erroranalytics/type/BunnyDelay`,
        "label": `Overall Bunny Delay API Errors`,
        "client:only": "preact",
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph.js",
        "client:component-export": "default"
      })}</main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro", void 0);
    $$file3 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro";
    $$url3 = "/delay/overview";
    page4 = () => overview_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/hooks/dist/hooks.mjs
function p2(n3, t4) {
  c2.__h && c2.__h(r3, n3, o3 || t4), o3 = 0;
  var u5 = r3.__H || (r3.__H = { __: [], __h: [] });
  return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
}
function d2(n3) {
  return o3 = 1, h2(D2, n3);
}
function h2(n3, u5, i5) {
  var o5 = p2(t3++, 2);
  if (o5.t = n3, !o5.__c && (o5.__ = [i5 ? i5(u5) : D2(void 0, u5), function(n4) {
    var t4 = o5.__N ? o5.__N[0] : o5.__[0], r5 = o5.t(t4, n4);
    t4 !== r5 && (o5.__N = [r5, o5.__[1]], o5.__c.setState({}));
  }], o5.__c = r3, !r3.__f)) {
    var f5 = function(n4, t4, r5) {
      if (!o5.__c.__H) return true;
      var u6 = o5.__c.__H.__.filter(function(n5) {
        return n5.__c;
      });
      if (u6.every(function(n5) {
        return !n5.__N;
      })) return !c4 || c4.call(this, n4, t4, r5);
      var i6 = o5.__c.props !== n4;
      return u6.some(function(n5) {
        if (n5.__N) {
          var t5 = n5.__[0];
          n5.__ = n5.__N, n5.__N = void 0, t5 !== n5.__[0] && (i6 = true);
        }
      }), c4 && c4.call(this, n4, t4, r5) || i6;
    };
    r3.__f = true;
    var c4 = r3.shouldComponentUpdate, e4 = r3.componentWillUpdate;
    r3.componentWillUpdate = function(n4, t4, r5) {
      if (this.__e) {
        var u6 = c4;
        c4 = void 0, f5(n4, t4, r5), c4 = u6;
      }
      e4 && e4.call(this, n4, t4, r5);
    }, r3.shouldComponentUpdate = f5;
  }
  return o5.__N || o5.__;
}
function y2(n3, u5) {
  var i5 = p2(t3++, 3);
  !c2.__s && C2(i5.__H, u5) && (i5.__ = n3, i5.u = u5, r3.__H.__h.push(i5));
}
function A2(n3) {
  return o3 = 5, T2(function() {
    return { current: n3 };
  }, []);
}
function T2(n3, r5) {
  var u5 = p2(t3++, 7);
  return C2(u5.__H, r5) && (u5.__ = n3(), u5.__H = r5, u5.__h = n3), u5.__;
}
function j2() {
  for (var n3; n3 = f2.shift(); ) {
    var t4 = n3.__H;
    if (n3.__P && t4) try {
      t4.__h.some(z2), t4.__h.some(B2), t4.__h = [];
    } catch (r5) {
      t4.__h = [], c2.__e(r5, n3.__v);
    }
  }
}
function w2(n3) {
  var t4, r5 = function() {
    clearTimeout(u5), k2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u5 = setTimeout(r5, 35);
  k2 && (t4 = requestAnimationFrame(r5));
}
function z2(n3) {
  var t4 = r3, u5 = n3.__c;
  "function" == typeof u5 && (n3.__c = void 0, u5()), r3 = t4;
}
function B2(n3) {
  var t4 = r3;
  n3.__c = n3.__(), r3 = t4;
}
function C2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r5) {
    return t5 !== n3[r5];
  });
}
function D2(n3, t4) {
  return "function" == typeof t4 ? t4(n3) : t4;
}
var t3, r3, u2, i3, o3, f2, c2, e3, a3, v2, l2, m2, s3, k2;
var init_hooks = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/hooks/dist/hooks.mjs"() {
    init_preact();
    o3 = 0;
    f2 = [];
    c2 = l;
    e3 = c2.__b;
    a3 = c2.__r;
    v2 = c2.diffed;
    l2 = c2.__c;
    m2 = c2.unmount;
    s3 = c2.__;
    c2.__b = function(n3) {
      r3 = null, e3 && e3(n3);
    }, c2.__ = function(n3, t4) {
      n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s3 && s3(n3, t4);
    }, c2.__r = function(n3) {
      a3 && a3(n3), t3 = 0;
      var i5 = (r3 = n3.__c).__H;
      i5 && (u2 === r3 ? (i5.__h = [], r3.__h = [], i5.__.some(function(n4) {
        n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
      })) : (i5.__h.some(z2), i5.__h.some(B2), i5.__h = [], t3 = 0)), u2 = r3;
    }, c2.diffed = function(n3) {
      v2 && v2(n3);
      var t4 = n3.__c;
      t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i3 === c2.requestAnimationFrame || ((i3 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.some(function(n4) {
        n4.u && (n4.__H = n4.u), n4.u = void 0;
      })), u2 = r3 = null;
    }, c2.__c = function(n3, t4) {
      t4.some(function(n4) {
        try {
          n4.__h.some(z2), n4.__h = n4.__h.filter(function(n5) {
            return !n5.__ || B2(n5);
          });
        } catch (r5) {
          t4.some(function(n5) {
            n5.__h && (n5.__h = []);
          }), t4 = [], c2.__e(r5, n4.__v);
        }
      }), l2 && l2(n3, t4);
    }, c2.unmount = function(n3) {
      m2 && m2(n3);
      var t4, r5 = n3.__c;
      r5 && r5.__H && (r5.__H.__.some(function(n4) {
        try {
          z2(n4);
        } catch (n5) {
          t4 = n5;
        }
      }), r5.__H = void 0, t4 && c2.__e(t4, r5.__v));
    };
    k2 = "function" == typeof requestAnimationFrame;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/compat/dist/compat.mjs
function g3(n3, t4) {
  for (var e4 in t4) n3[e4] = t4[e4];
  return n3;
}
function E2(n3, t4) {
  for (var e4 in n3) if ("__source" !== e4 && !(e4 in t4)) return true;
  for (var r5 in t4) if ("__source" !== r5 && n3[r5] !== t4[r5]) return true;
  return false;
}
function M2(n3, t4) {
  this.props = n3, this.context = t4;
}
function V2(n3, t4, e4) {
  return n3 && (n3.__c && n3.__c.__H && (n3.__c.__H.__.forEach(function(n4) {
    "function" == typeof n4.__c && n4.__c();
  }), n3.__c.__H = null), null != (n3 = g3({}, n3)).__c && (n3.__c.__P === e4 && (n3.__c.__P = t4), n3.__c.__e = true, n3.__c = null), n3.__k = n3.__k && n3.__k.map(function(n4) {
    return V2(n4, t4, e4);
  })), n3;
}
function W2(n3, t4, e4) {
  return n3 && e4 && (n3.__v = null, n3.__k = n3.__k && n3.__k.map(function(n4) {
    return W2(n4, t4, e4);
  }), n3.__c && n3.__c.__P === t4 && (n3.__e && e4.appendChild(n3.__e), n3.__c.__e = true, n3.__c.__P = e4)), n3;
}
function P3() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j3(n3) {
  var t4 = n3.__ && n3.__.__c;
  return t4 && t4.__a && t4.__a(n3);
}
function B3() {
  this.i = null, this.l = null;
}
var T3, A3, O2, U2, H2, q3, G2, J2, K2, Q2, X2, en, rn, un, on, ln, cn;
var init_compat = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/compat/dist/compat.mjs"() {
    init_preact();
    init_preact();
    init_hooks();
    init_hooks();
    (M2.prototype = new C()).isPureReactComponent = true, M2.prototype.shouldComponentUpdate = function(n3, t4) {
      return E2(this.props, n3) || E2(this.state, t4);
    };
    T3 = l.__b;
    l.__b = function(n3) {
      n3.type && n3.type.__f && n3.ref && (n3.props.ref = n3.ref, n3.ref = null), T3 && T3(n3);
    };
    A3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.forward_ref") || 3911;
    O2 = l.__e;
    l.__e = function(n3, t4, e4, r5) {
      if (n3.then) {
        for (var u5, o5 = t4; o5 = o5.__; ) if ((u5 = o5.__c) && u5.__c) return null == t4.__e && (t4.__e = e4.__e, t4.__k = e4.__k), u5.__c(n3, t4);
      }
      O2(n3, t4, e4, r5);
    };
    U2 = l.unmount;
    l.unmount = function(n3) {
      var t4 = n3.__c;
      t4 && (t4.__z = true), t4 && t4.__R && t4.__R(), t4 && 32 & n3.__u && (n3.type = null), U2 && U2(n3);
    }, (P3.prototype = new C()).__c = function(n3, t4) {
      var e4 = t4.__c, r5 = this;
      null == r5.o && (r5.o = []), r5.o.push(e4);
      var u5 = j3(r5.__v), o5 = false, i5 = function() {
        o5 || r5.__z || (o5 = true, e4.__R = null, u5 ? u5(c4) : c4());
      };
      e4.__R = i5;
      var l4 = e4.__P;
      e4.__P = null;
      var c4 = function() {
        if (!--r5.__u) {
          if (r5.state.__a) {
            var n4 = r5.state.__a;
            r5.__v.__k[0] = W2(n4, n4.__c.__P, n4.__c.__O);
          }
          var t5;
          for (r5.setState({ __a: r5.__b = null }); t5 = r5.o.pop(); ) t5.__P = l4, t5.forceUpdate();
        }
      };
      r5.__u++ || 32 & t4.__u || r5.setState({ __a: r5.__b = r5.__v.__k[0] }), n3.then(i5, i5);
    }, P3.prototype.componentWillUnmount = function() {
      this.o = [];
    }, P3.prototype.render = function(n3, e4) {
      if (this.__b) {
        if (this.__v.__k) {
          var r5 = document.createElement("div"), o5 = this.__v.__k[0].__c;
          this.__v.__k[0] = V2(this.__b, r5, o5.__O = o5.__P);
        }
        this.__b = null;
      }
      var i5 = e4.__a && k(S, null, n3.fallback);
      return i5 && (i5.__u &= -33), [k(S, null, e4.__a ? null : n3.children), i5];
    };
    H2 = function(n3, t4, e4) {
      if (++e4[1] === e4[0] && n3.l.delete(t4), n3.props.revealOrder && ("t" !== n3.props.revealOrder[0] || !n3.l.size)) for (e4 = n3.i; e4; ) {
        for (; e4.length > 3; ) e4.pop()();
        if (e4[1] < e4[0]) break;
        n3.i = e4 = e4[2];
      }
    };
    (B3.prototype = new C()).__a = function(n3) {
      var t4 = this, e4 = j3(t4.__v), r5 = t4.l.get(n3);
      return r5[0]++, function(u5) {
        var o5 = function() {
          t4.props.revealOrder ? (r5.push(u5), H2(t4, n3, r5)) : u5();
        };
        e4 ? e4(o5) : o5();
      };
    }, B3.prototype.render = function(n3) {
      this.i = null, this.l = /* @__PURE__ */ new Map();
      var t4 = F(n3.children);
      n3.revealOrder && "b" === n3.revealOrder[0] && t4.reverse();
      for (var e4 = t4.length; e4--; ) this.l.set(t4[e4], this.i = [1, 0, this.i]);
      return n3.children;
    }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
      var n3 = this;
      this.l.forEach(function(t4, e4) {
        H2(n3, e4, t4);
      });
    };
    q3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103;
    G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
    J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
    K2 = /[A-Z0-9]/g;
    Q2 = "undefined" != typeof document;
    X2 = function(n3) {
      return ("undefined" != typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n3);
    };
    C.prototype.isReactComponent = true, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t4) {
      Object.defineProperty(C.prototype, t4, { configurable: true, get: function() {
        return this["UNSAFE_" + t4];
      }, set: function(n3) {
        Object.defineProperty(this, t4, { configurable: true, writable: true, value: n3 });
      } });
    });
    en = l.event;
    l.event = function(n3) {
      return en && (n3 = en(n3)), n3.persist = function() {
      }, n3.isPropagationStopped = function() {
        return this.cancelBubble;
      }, n3.isDefaultPrevented = function() {
        return this.defaultPrevented;
      }, n3.nativeEvent = n3;
    };
    un = { configurable: true, get: function() {
      return this.class;
    } };
    on = l.vnode;
    l.vnode = function(n3) {
      "string" == typeof n3.type && (function(n4) {
        var t4 = n4.props, e4 = n4.type, u5 = {}, o5 = -1 == e4.indexOf("-");
        for (var i5 in t4) {
          var l4 = t4[i5];
          if (!("value" === i5 && "defaultValue" in t4 && null == l4 || Q2 && "children" === i5 && "noscript" === e4 || "class" === i5 || "className" === i5)) {
            var c4 = i5.toLowerCase();
            "defaultValue" === i5 && "value" in t4 && null == t4.value ? i5 = "value" : "download" === i5 && true === l4 ? l4 = "" : "translate" === c4 && "no" === l4 ? l4 = false : "o" === c4[0] && "n" === c4[1] ? "ondoubleclick" === c4 ? i5 = "ondblclick" : "onchange" !== c4 || "input" !== e4 && "textarea" !== e4 || X2(t4.type) ? "onfocus" === c4 ? i5 = "onfocusin" : "onblur" === c4 ? i5 = "onfocusout" : J2.test(i5) && (i5 = c4) : c4 = i5 = "oninput" : o5 && G2.test(i5) ? i5 = i5.replace(K2, "-$&").toLowerCase() : null === l4 && (l4 = void 0), "oninput" === c4 && u5[i5 = c4] && (i5 = "oninputCapture"), u5[i5] = l4;
          }
        }
        "select" == e4 && (u5.multiple && Array.isArray(u5.value) && (u5.value = F(t4.children).forEach(function(n5) {
          n5.props.selected = -1 != u5.value.indexOf(n5.props.value);
        })), null != u5.defaultValue && (u5.value = F(t4.children).forEach(function(n5) {
          n5.props.selected = u5.multiple ? -1 != u5.defaultValue.indexOf(n5.props.value) : u5.defaultValue == n5.props.value;
        }))), t4.class && !t4.className ? (u5.class = t4.class, Object.defineProperty(u5, "className", un)) : t4.className && (u5.class = u5.className = t4.className), n4.props = u5;
      })(n3), n3.$$typeof = q3, on && on(n3);
    };
    ln = l.__r;
    l.__r = function(n3) {
      ln && ln(n3), rn = n3.__c;
    };
    cn = l.diffed;
    l.diffed = function(n3) {
      cn && cn(n3);
      var t4 = n3.props, e4 = n3.__e;
      null != e4 && "textarea" === n3.type && "value" in t4 && t4.value !== e4.value && (e4.value = null == t4.value ? "" : t4.value), rn = null;
    };
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
function u3(e4, t4, n3, o5, i5, u5) {
  t4 || (t4 = {});
  var a5, c4, p4 = t4;
  if ("ref" in p4) for (c4 in p4 = {}, t4) "ref" == c4 ? a5 = t4[c4] : p4[c4] = t4[c4];
  var l4 = { type: e4, props: p4, key: n3, ref: a5, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i5, __self: u5 };
  if ("function" == typeof e4 && (a5 = e4.defaultProps)) for (c4 in a5) void 0 === p4[c4] && (p4[c4] = a5[c4]);
  return l.vnode && l.vnode(l4), l4;
}
var f3;
var init_jsxRuntime = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/preact@10.29.2/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs"() {
    init_preact();
    init_preact();
    f3 = 0;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/Sparkline_tAhqvrSY.mjs
function jobHealth(job, hasIncident = false) {
  if (job.currentRunStatus === "API_Error" && job.lastRunStatus === "API_Error" || job.predictedRunStatus === "API_Error") return "bad";
  if (hasIncident || job.type === "delayed" || job.predictedRunStatus === "Delayed" || job.currentRunStatus === "Undeployed" && (job.currentRunLengthMs ?? 0) > 3e4) return "elevated";
  return "good";
}
function dotClass(health) {
  return health === "good" ? "bg-green-500" : health === "elevated" ? "bg-amber-500" : "bg-red-500";
}
function cssStatusColor(health) {
  if (typeof document === "undefined") return "#10b981";
  return getComputedStyle(document.documentElement).getPropertyValue("--status-" + health).trim() || "#10b981";
}
function buildPaths(points, xMin, xSpan) {
  const ys = points.map((p4) => p4.y);
  const min = Math.min(...ys);
  const span = Math.max(...ys) - min || 1;
  const n3 = points.length;
  const pts = points.map((p4, i5) => {
    return [xSpan > 0 ? (p4.x - xMin) / xSpan * W3 : n3 === 1 ? W3 / 2 : i5 / (n3 - 1) * W3, 29 - (p4.y - min) / span * 26];
  });
  const line = pts.map(([x4, y4], i5) => `${i5 === 0 ? "M" : "L"}${x4.toFixed(2)},${y4.toFixed(2)}`).join(" ");
  return {
    line,
    area: `${line} L${pts[pts.length - 1][0].toFixed(2)},${H3} L${pts[0][0].toFixed(2)},${H3} Z`
  };
}
async function fetchSeries(endpoint, metric, days) {
  const end = Date.now();
  const start2 = end - days * 24 * 60 * 60 * 1e3;
  const url = `https://api.bunny.chaika.me/${endpoint}?StartDateTime=${new Date(start2).toISOString()}&EndDateTime=${new Date(end).toISOString()}&Metrics=${metric}`;
  return ((await (await fetch(url)).json())?.data?.points ?? []).map((p4) => {
    const x4 = p4.timePeriod ? new Date(p4.timePeriod).getTime() : null;
    let y4 = null;
    for (const k4 in p4) if (k4 !== "timePeriod") {
      y4 = Number(p4[k4]);
      break;
    }
    return {
      x: x4,
      y: y4
    };
  }).filter((p4) => p4.x != null && p4.y != null && isFinite(p4.y));
}
async function fetchErrors(errorEndpoint, days) {
  const end = Date.now();
  const start2 = end - days * 24 * 60 * 60 * 1e3;
  const url = `https://api.bunny.chaika.me/${errorEndpoint}?StartDateTime=${new Date(start2).toISOString()}&EndDateTime=${new Date(end).toISOString()}&Metrics=AvgRunLength`;
  const points = (await (await fetch(url)).json())?.data?.points ?? [];
  const byTime = /* @__PURE__ */ new Map();
  for (const p4 of points) {
    if (!p4.timePeriod) continue;
    const x4 = new Date(p4.timePeriod).getTime();
    byTime.set(x4, (byTime.get(x4) || 0) + (Number(p4.count) || 0));
  }
  return [...byTime.entries()].map(([x4, total]) => ({
    x: x4,
    total
  })).filter((p4) => p4.total > 0).sort((a5, b3) => a5.x - b3.x);
}
var W3, H3, Sparkline;
var init_Sparkline_tAhqvrSY = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/Sparkline_tAhqvrSY.mjs"() {
    "use strict";
    init_compat();
    init_jsxRuntime();
    W3 = 100;
    H3 = 32;
    Sparkline = (props) => {
      const { endpoint, metric = "MedianRunLength", health = "good", days = 7, errorEndpoint = null } = props;
      const [ys, setYs] = d2(null);
      const [errors, setErrors] = d2([]);
      const [color, setColor] = d2(() => cssStatusColor(health));
      const [errColor, setErrColor] = d2(() => cssStatusColor("bad"));
      const id = A2("spark-" + Math.random().toString(36).slice(2, 9)).current;
      y2(() => {
        let alive = true;
        fetchSeries(endpoint, metric, days).then((vals) => alive && setYs(vals)).catch(() => alive && setYs([]));
        if (errorEndpoint) fetchErrors(errorEndpoint, days).then((vals) => alive && setErrors(vals)).catch(() => alive && setErrors([]));
        return () => {
          alive = false;
        };
      }, [
        endpoint,
        metric,
        days,
        errorEndpoint
      ]);
      y2(() => {
        const onTheme = () => {
          setColor(cssStatusColor(health));
          setErrColor(cssStatusColor("bad"));
        };
        window.addEventListener("themeChange", onTheme);
        return () => window.removeEventListener("themeChange", onTheme);
      }, [health]);
      if (ys === null) return u3("div", {
        className: "w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm",
        style: { height: "32px" }
      });
      const hasLine = ys.length >= 2;
      const hasErrors = errors.length > 0;
      if (!hasLine && !hasErrors) return null;
      const allX = [...ys.map((p4) => p4.x), ...errors.map((p4) => p4.x)];
      const xMin = Math.min(...allX);
      const xSpan = Math.max(...allX) - xMin;
      const paths = hasLine ? buildPaths(ys, xMin, xSpan) : null;
      let bars = null;
      if (hasErrors) {
        const maxTotal = Math.max(...errors.map((p4) => p4.total));
        const bw = 2;
        bars = errors.map((p4, i5) => {
          const px = xSpan > 0 ? (p4.x - xMin) / xSpan * W3 : W3 / 2;
          const h3 = Math.max(1.5, p4.total / maxTotal * 29);
          return u3("rect", {
            x: (px - bw / 2).toFixed(2),
            y: (H3 - h3).toFixed(2),
            width: bw,
            height: h3.toFixed(2),
            fill: errColor,
            opacity: "0.35"
          }, i5);
        });
      }
      return u3("div", {
        className: "flex items-center gap-2 w-full",
        children: [u3("svg", {
          viewBox: `0 0 ${W3} ${H3}`,
          preserveAspectRatio: "none",
          className: "w-full",
          style: { height: "32px" },
          role: "img",
          "aria-label": hasErrors ? "recent history with errors" : "recent history",
          children: [
            u3("defs", { children: u3("linearGradient", {
              id,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
              children: [u3("stop", {
                offset: "0%",
                stopColor: color,
                stopOpacity: "0.22"
              }), u3("stop", {
                offset: "100%",
                stopColor: color,
                stopOpacity: "0"
              })]
            }) }),
            paths && u3("path", {
              d: paths.area,
              fill: `url(#${id})`,
              stroke: "none"
            }),
            bars,
            paths && u3("path", {
              d: paths.line,
              fill: "none",
              stroke: color,
              strokeWidth: "1.75",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke"
            })
          ]
        }), u3("span", {
          className: "text-gray text-xs whitespace-nowrap",
          children: [
            "\xB7",
            days,
            "d"
          ]
        })]
      });
    };
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/CategorySection_BzcgLFDU.mjs
var $$CategorySection;
var init_CategorySection_BzcgLFDU = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/CategorySection_BzcgLFDU.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    createAstro("https://astro.build");
    $$CategorySection = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$CategorySection;
      const { name, count, statusColor, open: open2 = false, bodyClass = "pt-5 pb-2" } = Astro.props;
      return renderTemplate`${maybeRenderHead($$result)}<details class="category-section" data-category${addAttribute(open2, "open")} data-astro-cid-yipa6tc6><summary class="surface surface-hover flex items-center justify-between gap-3 cursor-pointer select-none px-4 py-3" data-astro-cid-yipa6tc6><span class="flex items-center gap-2.5 min-w-0" data-astro-cid-yipa6tc6>${statusColor && renderTemplate`<span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${statusColor}`, "class")} data-astro-cid-yipa6tc6></span>`}<span class="font-semibold text-lg truncate" data-astro-cid-yipa6tc6>${name}</span><span class="shrink-0 text-sm text-gray-500 dark:text-gray-400 tabular-nums" data-count data-astro-cid-yipa6tc6>${count}</span></span><svg class="chevron shrink-0 w-5 h-5 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-yipa6tc6><polyline points="6 9 12 15 18 9" data-astro-cid-yipa6tc6></polyline></svg></summary><div${addAttribute(bodyClass, "class")} data-astro-cid-yipa6tc6>${renderSlot($$result, $$slots["default"])}</div></details>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/CategorySection.astro", void 0);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/jobCategories_NI2Xed_h.mjs
function titleCase(s5) {
  return s5.split(/[-_]/).filter(Boolean).map((w4) => w4.charAt(0).toUpperCase() + w4.slice(1)).join(" ");
}
function perfProvider(job) {
  const seg = (job.internalJobName || job.jobName).toLowerCase().split("-")[0];
  if (!seg) return {
    key: OTHER_KEY,
    name: OTHER_NAME
  };
  return {
    key: seg,
    name: PERF_PROVIDER_NAMES[seg] ?? titleCase(seg)
  };
}
function perfWorkload(job) {
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const provider = perfProvider(job).name;
  for (const [rx, service, category] of PERF_WORKLOAD_RULES) if (rx.test(name)) return {
    category,
    service,
    provider
  };
  const seg = name.split("-")[1] ?? "";
  return {
    category: OTHER_NAME,
    service: seg ? titleCase(seg) : OTHER_NAME,
    provider
  };
}
function perfOperation(name) {
  if (name.includes("uploadanddownload")) return "Up+Down";
  const up = name.includes("upload");
  const down = name.includes("download");
  if (up && down) return "Up+Down";
  if (up) return "Upload";
  if (down) return "Download";
  return "";
}
function perfVariant(job) {
  const { category, service, provider } = perfWorkload(job);
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const operation = perfOperation(name);
  const parentLabel = operation ? `${service} ${operation}` : service;
  const parentKey = `${provider}|${service}|${operation}`;
  const strip = new Set(PERF_SERVICE_LEAD[service] ?? []);
  const toks = name.split("-").slice(1).filter((t4) => !PERF_OP_TOKENS.has(t4) && !strip.has(t4));
  return {
    category,
    service,
    provider,
    operation,
    parentKey,
    parentLabel,
    variantLabel: toks.length ? toks.map(titleCase).join(" \xB7 ") : "default"
  };
}
function aiAuthor(job) {
  const parts = (job.internalJobName || job.jobName).toLowerCase().replace(/^@/, "").split("/");
  const author = parts.length >= 3 ? parts[1] : parts[0];
  if (!author) return {
    key: OTHER_KEY,
    name: OTHER_NAME
  };
  return {
    key: author,
    name: AI_AUTHOR_NAMES[author] ?? titleCase(author)
  };
}
function isPopularAiModel(job) {
  const model = (job.internalJobName || job.jobName).toLowerCase().split("/").pop() ?? "";
  return AI_POPULAR_MODEL_PREFIXES.some((p4) => model.startsWith(p4));
}
function groupJobs(jobs, type) {
  const visible = jobs.filter((j5) => !HIDDEN_JOBS.has(j5.internalJobName));
  if (type === "delay") {
    const buckets2 = /* @__PURE__ */ new Map();
    for (const job of visible) {
      const cat = DELAY_CATEGORY_BY_JOB.get(job.internalJobName);
      const key = cat ? cat.key : OTHER_KEY;
      (buckets2.get(key) ?? buckets2.set(key, []).get(key)).push(job);
    }
    const groups2 = [];
    for (const cat of DELAY_CATEGORIES) {
      const list = buckets2.get(cat.key);
      if (list && list.length) groups2.push({
        key: cat.key,
        name: cat.name,
        jobs: sortJobs(list)
      });
    }
    const other = buckets2.get(OTHER_KEY);
    if (other && other.length) groups2.push({
      key: OTHER_KEY,
      name: OTHER_NAME,
      jobs: sortJobs(other)
    });
    return groups2;
  }
  if (type === "perf") {
    const buckets2 = /* @__PURE__ */ new Map();
    for (const job of visible) {
      const { category } = perfWorkload(job);
      (buckets2.get(category) ?? buckets2.set(category, []).get(category)).push(job);
    }
    const groups2 = [];
    for (const category of PERF_WORKLOAD_ORDER) {
      const list = buckets2.get(category);
      if (list && list.length) groups2.push({
        key: category,
        name: category,
        jobs: sortJobs(list)
      });
    }
    return groups2;
  }
  const popular = visible.filter(isPopularAiModel);
  const rest = visible.filter((j5) => !isPopularAiModel(j5));
  const names = /* @__PURE__ */ new Map();
  const buckets = /* @__PURE__ */ new Map();
  for (const job of rest) {
    const { key, name } = aiAuthor(job);
    names.set(key, name);
    (buckets.get(key) ?? buckets.set(key, []).get(key)).push(job);
  }
  const keys = [...buckets.keys()].sort((a5, b3) => {
    if (a5 === OTHER_KEY) return 1;
    if (b3 === OTHER_KEY) return -1;
    return (names.get(a5) ?? a5).localeCompare(names.get(b3) ?? b3);
  });
  const groups = [];
  if (popular.length) groups.push({
    key: AI_POPULAR_KEY,
    name: AI_POPULAR_NAME,
    jobs: sortJobs(popular)
  });
  for (const key of keys) groups.push({
    key,
    name: names.get(key) ?? key,
    jobs: sortJobs(buckets.get(key))
  });
  return groups;
}
function sortJobs(jobs) {
  return [...jobs].sort((a5, b3) => a5.internalJobName.localeCompare(b3.internalJobName));
}
var DELAY_CATEGORIES, HIDDEN_JOBS, statusConfig, DELAY_CATEGORY_BY_JOB, OTHER_KEY, OTHER_NAME, PERF_PROVIDER_NAMES, AI_AUTHOR_NAMES, PERF_WORKLOAD_ORDER, PERF_WORKLOAD_RULES, PERF_SERVICE_LEAD, PERF_OP_TOKENS, AI_POPULAR_MODEL_PREFIXES, AI_POPULAR_KEY, AI_POPULAR_NAME;
var init_jobCategories_NI2Xed_h = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/jobCategories_NI2Xed_h.mjs"() {
    "use strict";
    DELAY_CATEGORIES = [
      {
        key: "dns",
        name: "DNS",
        items: [{
          jobName: "bunnydns",
          name: "DNS Update Delay"
        }]
      },
      {
        key: "edge",
        name: "Edge",
        items: [{
          jobName: "bunnyedgerule",
          name: "Edge Rule Update Delay"
        }, {
          jobName: "bunnyedgescript",
          name: "Edge Script Delay"
        }]
      },
      {
        key: "storage",
        name: "Storage",
        items: [{
          jobName: "bunnystoragereplication",
          name: "Storage Replication Delay"
        }]
      },
      {
        key: "logging",
        name: "Logging",
        items: [{
          jobName: "bunnylogforwarder",
          name: "Log Forwarder Delay"
        }]
      }
    ];
    HIDDEN_JOBS = /* @__PURE__ */ new Set(["workertesting"]);
    statusConfig = { groups: DELAY_CATEGORIES.map((c4) => ({
      name: c4.name,
      items: c4.items.map((i5) => ({
        name: i5.name,
        jobName: i5.jobName
      }))
    })) };
    DELAY_CATEGORY_BY_JOB = /* @__PURE__ */ new Map();
    for (const cat of DELAY_CATEGORIES) for (const item of cat.items) DELAY_CATEGORY_BY_JOB.set(item.jobName, cat);
    OTHER_KEY = "other";
    OTHER_NAME = "Other";
    PERF_PROVIDER_NAMES = {
      cloudflare: "Cloudflare",
      bunny: "Bunny",
      aws: "AWS",
      azure: "Azure",
      googlecloud: "Google Cloud",
      fastly: "Fastly",
      fly: "Fly.io",
      backblaze: "Backblaze",
      turso: "Turso",
      xenyth: "Xenyth"
    };
    AI_AUTHOR_NAMES = {
      meta: "Meta",
      "meta-llama": "Meta",
      mistral: "Mistral",
      mistralai: "Mistral",
      qwen: "Qwen",
      google: "Google",
      openai: "OpenAI",
      deepseek: "DeepSeek",
      "deepseek-ai": "DeepSeek",
      moonshotai: "Moonshot AI",
      baai: "BAAI",
      thebloke: "TheBloke",
      microsoft: "Microsoft",
      nvidia: "NVIDIA",
      "ai4bharat": "AI4Bharat",
      deepgram: "Deepgram",
      tiiuae: "TII",
      tinyllama: "TinyLlama",
      nexusflow: "Nexusflow",
      openchat: "OpenChat",
      fblgit: "FBL",
      nousresearch: "Nous Research",
      "zai-org": "Z.ai",
      "myshell-ai": "MyShell",
      pfnet: "PFN",
      "huggingface": "Hugging Face"
    };
    PERF_WORKLOAD_ORDER = [
      "Compute & Functions",
      "Object Storage",
      "Key-Value",
      "SQL & Databases",
      OTHER_NAME
    ];
    PERF_WORKLOAD_RULES = [
      [
        /durableobjects/,
        "Durable Objects",
        "Key-Value"
      ],
      [
        /(^|-)kv(-|$)/,
        "KV",
        "Key-Value"
      ],
      [
        /(^|-)r2(-|$)/,
        "R2",
        "Object Storage"
      ],
      [
        /(^|-)d1(-|$)/,
        "D1",
        "SQL & Databases"
      ],
      [
        /edgedb/,
        "EdgeDB",
        "SQL & Databases"
      ],
      [
        /turso/,
        "Turso",
        "SQL & Databases"
      ],
      [
        /googlecloud-sql/,
        "Cloud SQL",
        "SQL & Databases"
      ],
      [
        /aws-storage/,
        "S3",
        "Object Storage"
      ],
      [
        /googlecloud-storage/,
        "Cloud Storage",
        "Object Storage"
      ],
      [
        /ssdstorage/,
        "SSD Storage",
        "Object Storage"
      ],
      [
        /(^|-)b2(-|$)/,
        "B2",
        "Object Storage"
      ],
      [
        /tigris/,
        "Tigris",
        "Object Storage"
      ],
      [
        /xenyth-os/,
        "Object Storage",
        "Object Storage"
      ],
      [
        /lambda/,
        "Lambda",
        "Compute & Functions"
      ],
      [
        /cloudfront-functions/,
        "CloudFront Functions",
        "Compute & Functions"
      ],
      [
        /googlecloud-run/,
        "Cloud Run",
        "Compute & Functions"
      ],
      [
        /containerapp/,
        "Container Apps",
        "Compute & Functions"
      ],
      [
        /magiccontainers/,
        "Magic Containers",
        "Compute & Functions"
      ],
      [
        /(^|-)containers(-|$)/,
        "Containers",
        "Compute & Functions"
      ],
      [
        /(^|-)scripts(-|$)/,
        "Edge Scripting",
        "Compute & Functions"
      ],
      [
        /(^|-)compute(-|$)/,
        "Compute",
        "Compute & Functions"
      ],
      [
        /(^|-)pages(-|$)/,
        "Pages",
        "Compute & Functions"
      ],
      [
        /workerassets/,
        "Worker Assets",
        "Compute & Functions"
      ],
      [
        /python-worker/,
        "Python Workers",
        "Compute & Functions"
      ],
      [
        /(^|-)worker(-|$)/,
        "Workers",
        "Compute & Functions"
      ]
    ];
    PERF_SERVICE_LEAD = {
      "Durable Objects": ["durableobjects"],
      KV: ["kv"],
      R2: ["r2"],
      D1: ["d1"],
      EdgeDB: ["edgedb"],
      Turso: ["db"],
      "Cloud SQL": ["sql"],
      S3: ["storage"],
      "Cloud Storage": ["storage"],
      "SSD Storage": ["ssdstorage"],
      B2: ["b2"],
      Tigris: ["tigris"],
      "Object Storage": ["os"],
      Lambda: ["lambda"],
      "CloudFront Functions": ["cloudfront", "functions"],
      "Cloud Run": ["run"],
      "Container Apps": ["containerapp"],
      "Magic Containers": ["magiccontainers"],
      Containers: ["containers"],
      "Edge Scripting": ["scripts"],
      Compute: ["compute"],
      Pages: ["pages"],
      "Worker Assets": ["workerassets"],
      "Python Workers": ["python", "worker"],
      Workers: ["worker"]
    };
    PERF_OP_TOKENS = /* @__PURE__ */ new Set([
      "upload",
      "download",
      "uploadanddownload"
    ]);
    AI_POPULAR_MODEL_PREFIXES = ["kimi-", "glm-"];
    AI_POPULAR_KEY = "popular";
    AI_POPULAR_NAME = "Popular Models";
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/delay_BwpMe9sD.mjs
var delay_BwpMe9sD_exports = {};
__export(delay_BwpMe9sD_exports, {
  page: () => page5
});
var $$JobDisplay, $$Grid, delay_exports, $$Delay, $$file4, $$url4, page5;
var init_delay_BwpMe9sD = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/delay_BwpMe9sD.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_Sparkline_tAhqvrSY();
    init_CategorySection_BzcgLFDU();
    init_jobCategories_NI2Xed_h();
    createAstro("https://astro.build");
    $$JobDisplay = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$JobDisplay;
      let lastUpdatedTxt = "";
      let delayTxt = "";
      let delayTxtUnit = "";
      let pending = {
        className: "",
        textContent: ""
      };
      const job = Astro.props.job;
      const type = Astro.props.type;
      function formatTime(ms) {
        if (ms == void 0 || isNaN(ms)) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) return seconds.toFixed(2) + " second(s)";
        let minutes = seconds / 60;
        if (minutes < 60) return minutes.toFixed(2) + " minute(s)";
        return (minutes / 60).toFixed(2) + " hour(s)";
      }
      function formatTimeReturnUnit(ms) {
        if (ms == void 0) return ["", ""];
        let seconds = ms / 1e3;
        if (seconds < 60) return [seconds.toFixed(2), `second(s)`];
        let minutes = seconds / 60;
        if (minutes < 60) return [minutes.toFixed(2), `minute(s)`];
        return [(minutes / 60).toFixed(2), `hour(s)`];
      }
      let quickAnalyticsData = Astro.props.stats;
      let peakPeriod, dailyMedian, getJobMedian, monthlyMedian, peakPeriodTxt, quarterlyMedian;
      quickAnalyticsData?.forEach((item) => {
        switch (item.period) {
          case "Last 1 Day":
            dailyMedian = formatTime(parseInt(item.median_run_length));
            if (item.median_run_length && parseInt(item.median_run_length) > 0) getJobMedian = parseInt(item.median_run_length);
            break;
          case "Last 30 Days":
            monthlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          case "Last 90 Days":
            quarterlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          default:
            peakPeriod = formatTime(parseInt(item.median_run_length));
            peakPeriodTxt = `From ${(/* @__PURE__ */ new Date(item.period + "Z")).toLocaleTimeString()} - ${new Date((/* @__PURE__ */ new Date(item.period + "Z")).getTime() + parseInt(item.median_run_length)).toLocaleTimeString()}`;
        }
      });
      var runTimeToUse = job.currentRunTime;
      job.currentRunLengthMs;
      if (job.currentRunStatus === "Deployed" || job.currentRunStatus === "Success") {
        if (job.internalJobName === "cron") delayTxtUnit = "Last Event: " + formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(job.currentRunTime).getTime()) + " ago";
        else [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        pending.className = "";
        pending.textContent = "";
      } else if (job.currentRunStatus === "Undeployed" && (!getJobMedian || (job.currentRunLengthMs ?? 0) > getJobMedian * 1.2) && (job.currentRunLengthMs ?? 0) > 5e3) {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        if ((!getJobMedian || (job.currentRunLengthMs ?? 0) * 3 > getJobMedian) && (job.currentRunLengthMs ?? 0) > 3e4) {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightRed";
        } else {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightYellow";
        }
      } else if (job.currentRunStatus == "API_Error" && job.lastRunStatus == "API_Error") {
        delayTxt = "CF API Error";
        delayTxtUnit = "";
        pending.textContent = "CF API Error";
        pending.className = "highlightRed";
      } else if (job.currentRunStatus === "Failure") {
        delayTxt = "Error";
        delayTxtUnit = "";
        pending.textContent = "Error";
        pending.className = "highlightRed";
      } else {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.lastRunLengthMs);
        pending.className = "";
        pending.textContent = "";
        runTimeToUse = job.lastRunTime;
        job.lastRunLengthMs;
      }
      let noLastUpdate = false;
      lastUpdatedTxt = formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(runTimeToUse ?? "").getTime()) + " ago";
      if (job.internalJobName === "cron") noLastUpdate = true;
      const hasIncident = Astro.props.hasIncident ?? false;
      const health = jobHealth(job, hasIncident);
      const dot = dotClass(health);
      const sparkEnc = job.internalJobName.replaceAll("/", "%2F");
      const sparkEndpoint = `v2/jobs/${sparkEnc}/analytics`;
      const sparkMetric = type === "perf" || type === "ai" ? "MedianApiResponseLatency" : "MedianRunLength";
      const sparkErrorEndpoint = type === "ai" ? `v2/jobs/${sparkEnc}/erroranalytics` : void 0;
      return renderTemplate`${maybeRenderHead($$result)}<div class="relative w-full min-w-0 min-h-80 surface surface-hover p-6 flex flex-col"${addAttribute(`${job.internalJobName}grid`, "id")} data-astro-cid-mxodym6o>${hasIncident && renderTemplate`<div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full" data-astro-cid-mxodym6o>Incident</div>`}<div class="flex items-center justify-between gap-2 mb-4" data-astro-cid-mxodym6o><span class="flex items-center gap-1.5 min-w-0" data-astro-cid-mxodym6o><a${addAttribute(`/${type}/${job.internalJobName}`, "href")} class="text-lg font-semibold text-[var(--accent-regular)] hover:underline break-words leading-tight" data-astro-cid-mxodym6o>${job.jobName.replaceAll("Job", "").trimEnd()}</a>${job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(job.jobDescription, "title")} data-astro-cid-mxodym6o>?</span>`}</span><span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dot}`, "class")}${addAttribute(health, "title")} data-astro-cid-mxodym6o></span></div><div class="text-5xl font-bold text-center mb-1"${addAttribute(`delayNumberOuter${job.internalJobName}`, "id")} data-astro-cid-mxodym6o><span class="text-5xl font-bold text-center"${addAttribute(`delayNumber${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${delayTxt}</span> <span class="text-lg"${addAttribute(`delayUnit${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${delayTxtUnit}</span>${type === "ai" && renderTemplate`<span class="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] align-middle cursor-help" title="For 100 output tokens" data-astro-cid-mxodym6o>?</span>`}</div><div${addAttribute(`${pending.className} text-center mb-1 h-4`, "class")}${addAttribute(`pending${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${pending.textContent}</div>${noLastUpdate ? null : renderTemplate`<div class="text-gray text-xs text-center mb-3"${addAttribute(`lastUpdate${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>Last Update: ${lastUpdatedTxt}</div>`}<div class="mt-1 mb-3" data-astro-cid-mxodym6o>${renderComponent($$result, "Sparkline", Sparkline, {
        "endpoint": sparkEndpoint,
        "metric": sparkMetric,
        "errorEndpoint": sparkErrorEndpoint,
        "health": health,
        "client:visible": true,
        "data-astro-cid-mxodym6o": true,
        "client:component-hydration": "visible",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx",
        "client:component-export": "default"
      })}</div><div class="mt-auto flex justify-center gap-6 border-t pt-3" data-astro-cid-mxodym6o>${dailyMedian && renderTemplate`<div class="text-center" data-astro-cid-mxodym6o><div class="text-gray text-xs" data-astro-cid-mxodym6o>1 Day</div><div class="font-semibold"${addAttribute(`median1d${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${dailyMedian}</div></div>`}${monthlyMedian && renderTemplate`<div class="text-center" data-astro-cid-mxodym6o><div class="text-gray text-xs" data-astro-cid-mxodym6o>30 Days</div><div class="font-semibold"${addAttribute(`median30d${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${monthlyMedian}</div></div>`}${quarterlyMedian && renderTemplate`<div class="text-center" data-astro-cid-mxodym6o><div class="text-gray text-xs" data-astro-cid-mxodym6o>90 Days</div><div class="font-semibold"${addAttribute(`median${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${quarterlyMedian}</div></div>`}</div>${!peakPeriod ? null : renderTemplate`<div class="text-center mt-3" data-astro-cid-mxodym6o><span class="text-gray text-xs" data-astro-cid-mxodym6o>24H Peak: </span><span class="text-gray text-xs font-semibold"${addAttribute(`peak${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${peakPeriod}</span><div class="text-gray text-xs"${addAttribute(`peak-period${job.internalJobName}`, "id")} data-astro-cid-mxodym6o>${peakPeriodTxt}</div></div>`}${type === "delay" && job.predictedDelayLengthMs && job.predictedDelayLengthMs > 0 && renderTemplate`<div class="text-gray text-xs text-center mt-2 italic" data-astro-cid-mxodym6o>Predicted: ~${formatTimeReturnUnit(job.predictedDelayLengthMs).join(" ")}</div>`}</div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobDisplay.astro", void 0);
    createAstro("https://astro.build");
    $$Grid = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Grid;
      const { variant } = Astro.props;
      return renderTemplate`${maybeRenderHead($$result)}<ul${addAttribute(["grid", {
        offset: variant === "offset",
        small: variant === "small"
      }], "class:list")} data-astro-cid-yvqpge4l>${renderSlot($$result, $$slots["default"])}</ul>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Grid.astro", void 0);
    delay_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Delay,
      file: () => $$file4,
      url: () => $$url4
    });
    $$Delay = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch("https://api.bunny.chaika.me/v2/jobs/type/BunnyDelay")).json()).data;
      };
      const getAnalytics = async () => {
        return await (await fetch("https://api.bunny.chaika.me/v1/quick/QuickAnalytics/type/BunnyDelay")).json();
      };
      const getOverallAnalytics = async () => {
        try {
          const r5 = await fetch("https://api.bunny.chaika.me/v2/jobs/OverallAnalytics");
          if (!r5.ok) return null;
          const json = await r5.json();
          return json.data ?? json;
        } catch {
          return null;
        }
      };
      const getIncidents = async () => {
        try {
          const r5 = await fetch("https://api.bunny.chaika.me/v2/incidents/type/BunnyDelay");
          return r5.ok ? (await r5.json()).data ?? [] : [];
        } catch {
          return [];
        }
      };
      const [jobs, stats, overall, incidents] = await Promise.all([
        getJobs(),
        getAnalytics(),
        getOverallAnalytics(),
        getIncidents()
      ]);
      const groups = groupJobs(jobs, "delay");
      const visibleJobs = groups.flatMap((g5) => g5.jobs);
      const hasIncident = (job) => incidents.some((i5) => i5.target === job.internalJobName && i5.active);
      const groupIssue = (groupJobsList) => groupJobsList.some((j5) => hasIncident(j5) || j5.predictedRunStatus === "API_Error" || j5.type === "delayed");
      return renderTemplate`<script>(function(){${defineScriptVars({
        visibleJobs,
        stats
      })}
globalThis.jobData = visibleJobs;
globalThis.jobStats = stats;
})();<\/script>${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Bunny Delay Monitoring",
        "description": "See Bunny Delay Monitoring Jobs"
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20"><main class="wrapper stack gap-8">${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Bunny Delay Jobs",
        "tagline": "See the delay between an action being performed (DNS Update, Worker Update, etc) and it being visible on edge from 50+ locations worldwide.",
        "align": "start"
      }, { "default": ($$result3) => renderTemplate`<a href="/delay/overview">Overview</a>` })}<a id="websocket-conn-status">Disconnected</a>${overall && renderTemplate`<div class="flex flex-wrap gap-6 justify-center text-sm py-2 border-t border-b border-gray-200 dark:border-gray-700"><span><strong class="text-gray-900 dark:text-white">${overall.uniqueJobs}</strong> delay jobs</span><span><strong class="text-gray-900 dark:text-white">${overall.uniqueLocations}</strong> locations</span><span><strong class="text-gray-900 dark:text-white">${(overall.normalJobPerLocationRunsLast24H ?? 0).toLocaleString()}</strong> location-runs in last 24h</span></div>`}<input id="job-filter" type="text" placeholder="Filter jobs..." class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><div class="stack gap-4">${groups.map((group) => renderTemplate`${renderComponent($$result2, "CategorySection", $$CategorySection, {
        "name": group.name,
        "count": group.jobs.length,
        "statusColor": groupIssue(group.jobs) ? "bg-yellow-500" : "bg-green-500",
        "open": true
      }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Grid", $$Grid, {}, { "default": ($$result4) => renderTemplate`${group.jobs.map((job) => renderTemplate`<li>${renderComponent($$result4, "JobDisplay", $$JobDisplay, {
        "type": "job",
        "job": job,
        "stats": stats.filter((stat) => stat.job_name.toLowerCase() == job.internalJobName),
        "hasIncident": hasIncident(job)
      })}</li>`)}` })}` })}`)}</div>${renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts")}<script src="/assets/js/8.0.7/signalr.min.js"> <\/script><script src="/assets/js/8.0.7/signalr-protocol-msgpack.min.js"> <\/script>${renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=1&lang.ts")}</main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro", void 0);
    $$file4 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro";
    $$url4 = "/delay";
    page5 = () => delay_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._CCxHbg8w.mjs
var CCxHbg8w_exports = {};
__export(CCxHbg8w_exports, {
  page: () => page6
});
var ____type__exports, $$Component, $$file5, $$url5, page6;
var init_CCxHbg8w = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._CCxHbg8w.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    ____type__exports = /* @__PURE__ */ __exportAll({
      default: () => $$Component,
      file: () => $$file5,
      url: () => $$url5
    });
    createAstro("https://astro.build");
    $$Component = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Component;
      console.log(Astro.params);
      return renderTemplate`${maybeRenderHead($$result)}<div><!-- @ts-ignore -->${renderComponent($$result, "SmartGraph", null, {
        "endpoint": Astro.url.searchParams.get("endpoint"),
        "label": Astro.url.searchParams.get("label"),
        "options": Astro.url.searchParams.get("options"),
        "fullscreen": "true",
        "client:only": "preact",
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/graph/[...type].astro", void 0);
    $$file5 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/graph/[...type].astro";
    $$url5 = "/graph/[...type]";
    page6 = () => ____type__exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/JobDetailHeader_BnxmItwH.mjs
var $$JobDetailHeader;
var init_JobDetailHeader_BnxmItwH = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/JobDetailHeader_BnxmItwH.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_Sparkline_tAhqvrSY();
    createAstro("https://astro.build");
    $$JobDetailHeader = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$JobDetailHeader;
      const { job, stats, type, successRate = null } = Astro.props;
      function formatTime(ms) {
        if (ms == void 0 || isNaN(ms)) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) return seconds.toFixed(2) + " second(s)";
        let minutes = seconds / 60;
        if (minutes < 60) return minutes.toFixed(2) + " minute(s)";
        return (minutes / 60).toFixed(2) + " hour(s)";
      }
      function formatTimeReturnUnit(ms) {
        if (ms == void 0) return ["", ""];
        let seconds = ms / 1e3;
        if (seconds < 60) return [seconds.toFixed(2), `second(s)`];
        let minutes = seconds / 60;
        if (minutes < 60) return [minutes.toFixed(2), `minute(s)`];
        return [(minutes / 60).toFixed(2), `hour(s)`];
      }
      let delayTxt = "";
      let delayTxtUnit = "";
      let pending = {
        className: "",
        textContent: ""
      };
      let peakPeriod, dailyMedian, getJobMedian, monthlyMedian, peakPeriodTxt, quarterlyMedian;
      stats?.forEach((item) => {
        switch (item.period) {
          case "Last 1 Day":
            dailyMedian = formatTime(parseInt(item.median_run_length));
            if (item.median_run_length && parseInt(item.median_run_length) > 0) getJobMedian = parseInt(item.median_run_length);
            break;
          case "Last 30 Days":
            monthlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          case "Last 90 Days":
            quarterlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          default:
            peakPeriod = formatTime(parseInt(item.median_run_length));
            peakPeriodTxt = `From ${(/* @__PURE__ */ new Date(item.period + "Z")).toLocaleTimeString()} - ${new Date((/* @__PURE__ */ new Date(item.period + "Z")).getTime() + parseInt(item.median_run_length)).toLocaleTimeString()}`;
        }
      });
      let runTimeToUse = job.currentRunTime;
      if (job.currentRunStatus === "Deployed" || job.currentRunStatus === "Success") {
        if (job.internalJobName === "cron") delayTxtUnit = "Last Event: " + formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(job.currentRunTime).getTime()) + " ago";
        else [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        pending.className = "";
        pending.textContent = "";
      } else if (job.currentRunStatus === "Undeployed" && (!getJobMedian || (job.currentRunLengthMs ?? 0) > getJobMedian * 1.2) && (job.currentRunLengthMs ?? 0) > 5e3) {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        if ((!getJobMedian || (job.currentRunLengthMs ?? 0) * 3 > getJobMedian) && (job.currentRunLengthMs ?? 0) > 3e4) {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightRed";
        } else {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightYellow";
        }
      } else if (job.currentRunStatus == "API_Error" && job.lastRunStatus == "API_Error") {
        delayTxt = "CF API Error";
        delayTxtUnit = "";
        pending.textContent = "CF API Error";
        pending.className = "highlightRed";
      } else if (job.currentRunStatus === "Failure") {
        delayTxt = "Error";
        delayTxtUnit = "";
        pending.textContent = "Error";
        pending.className = "highlightRed";
      } else {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.lastRunLengthMs);
        pending.className = "";
        pending.textContent = "";
        runTimeToUse = job.lastRunTime;
      }
      const noLastUpdate = job.internalJobName === "cron";
      const lastUpdatedTxt = formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(runTimeToUse ?? "").getTime()) + " ago";
      const health = jobHealth(job);
      const dot = dotClass(health);
      const sparkEndpoint = `v2/jobs/${job.internalJobName.replaceAll("/", "%2F")}/analytics`;
      const sparkMetric = type === "perf" || type === "ai" ? "MedianApiResponseLatency" : "MedianRunLength";
      const predicted = job.predictedDelayLengthMs && job.predictedDelayLengthMs > 0 ? formatTimeReturnUnit(job.predictedDelayLengthMs).join(" ") : "";
      return renderTemplate`${maybeRenderHead($$result)}<div class="surface px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"><!-- Value + sparkline --><div class="flex items-center gap-4 md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-6"><span${addAttribute(`shrink-0 w-3 h-3 rounded-full ${dot}`, "class")}${addAttribute(health, "title")}></span><div class="min-w-0"><div${addAttribute(`delayNumberOuter${job.internalJobName}`, "id")} class="leading-none"><span class="text-3xl md:text-4xl font-bold"${addAttribute(`delayNumber${job.internalJobName}`, "id")}>${delayTxt}</span><span class="text-base text-gray"${addAttribute(`delayUnit${job.internalJobName}`, "id")}>${delayTxtUnit}</span>${type === "ai" && renderTemplate`<span class="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] align-middle cursor-help" title="For 100 output tokens">?</span>`}</div><div${addAttribute(`${pending.className} text-xs mt-1 h-4`, "class")}${addAttribute(`pending${job.internalJobName}`, "id")}>${pending.textContent}</div></div><div class="hidden sm:flex flex-col items-center w-32 shrink-0">${renderComponent($$result, "Sparkline", Sparkline, {
        "endpoint": sparkEndpoint,
        "metric": sparkMetric,
        "health": health,
        "days": 7,
        "client:visible": true,
        "client:component-hydration": "visible",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx",
        "client:component-export": "default"
      })}</div></div><!-- Stat chips --><div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">${noLastUpdate ? null : renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">Last Update</span><span class="font-semibold"${addAttribute(`lastUpdate${job.internalJobName}`, "id")}>${lastUpdatedTxt}</span></div>`}${successRate != null && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">Success (24h)</span><span class="font-semibold">${successRate.toFixed(1)}%</span></div>`}${dailyMedian && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">1 Day</span><span class="font-semibold"${addAttribute(`median1d${job.internalJobName}`, "id")}>${dailyMedian}</span></div>`}${monthlyMedian && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">30 Days</span><span class="font-semibold"${addAttribute(`median30d${job.internalJobName}`, "id")}>${monthlyMedian}</span></div>`}${quarterlyMedian && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">90 Days</span><span class="font-semibold"${addAttribute(`median90d${job.internalJobName}`, "id")}>${quarterlyMedian}</span></div>`}${peakPeriod && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">24H Peak</span><span class="font-semibold"${addAttribute(`peak${job.internalJobName}`, "id")}>${peakPeriod}</span><span class="text-gray text-[10px]"${addAttribute(`peak-period${job.internalJobName}`, "id")}>${peakPeriodTxt}</span></div>`}${predicted && renderTemplate`<div class="flex flex-col"><span class="text-gray text-xs">Predicted</span><span class="font-semibold italic">~${predicted}</span></div>`}</div></div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobDetailHeader.astro", void 0);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._CcE-1gzU.mjs
var CcE_1gzU_exports = {};
__export(CcE_1gzU_exports, {
  page: () => page7
});
var ____internalJobName__exports, $$Component2, $$file6, $$url6, page7;
var init_CcE_1gzU = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._CcE-1gzU.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_JobDetailHeader_BnxmItwH();
    ____internalJobName__exports = /* @__PURE__ */ __exportAll({
      default: () => $$Component2,
      file: () => $$file6,
      url: () => $$url6
    });
    createAstro("https://astro.build");
    $$Component2 = createComponent(async ($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Component2;
      const { internalJobName } = Astro.params;
      let job = (await (await fetch("https://api.bunny.chaika.me/v2/jobs/" + internalJobName)).json()).data;
      if (!job) {
        job = { internalJobName: internalJobName ?? "" };
        console.log(`job was null`);
      }
      const quickAnalyticsResponse = await fetch("https://api.bunny.chaika.me/v1/quick/QuickAnalytics/" + (job?.internalJobName ?? job?.jobName));
      let quickAnalyticsData = [];
      if (quickAnalyticsResponse.ok) quickAnalyticsData = await quickAnalyticsResponse.json();
      const enc = job.internalJobName;
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": job?.jobName ?? "",
        "description": job?.jobDescription ?? "",
        "data-astro-cid-wi6vdr2w": true
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-8" data-astro-cid-wi6vdr2w><header class="wrapper stack gap-3" data-astro-cid-wi6vdr2w><a class="back-link" href="/delay/" data-astro-cid-wi6vdr2w>${renderComponent($$result2, "Icon", $$Icon, {
        "icon": "arrow-left",
        "data-astro-cid-wi6vdr2w": true
      })}All Jobs</a>${renderComponent($$result2, "Hero", $$Hero, {
        "title": job?.jobName,
        "align": "start",
        "data-astro-cid-wi6vdr2w": true
      }, { "default": ($$result3) => renderTemplate`<p data-astro-cid-wi6vdr2w>${job?.jobDescription}</p><a id="websocket-conn-status" data-astro-cid-wi6vdr2w>Disconnected</a>` })}${renderComponent($$result2, "JobDetailHeader", $$JobDetailHeader, {
        "job": job,
        "stats": quickAnalyticsData,
        "type": "job",
        "data-astro-cid-wi6vdr2w": true
      })}</header><main class="wrapper stack gap-6" data-astro-cid-wi6vdr2w><div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-astro-cid-wi6vdr2w><div class="surface p-4" data-astro-cid-wi6vdr2w>${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `v2/jobs/${enc}/analytics`,
        "label": job.jobName,
        "options": [
          "MedianRunLength",
          "MinRunLength",
          "MaxRunLength",
          "AvgRunLength"
        ],
        "client:only": "preact",
        "data-astro-cid-wi6vdr2w": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div><div class="surface p-4" data-astro-cid-wi6vdr2w>${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `v2/jobs/${enc}/analytics`,
        "label": job.jobName,
        "options": [
          "AvgApiResponseLatency",
          "MedianApiResponseLatency",
          "MinApiResponseLatency",
          "MaxApiResponseLatency"
        ],
        "client:only": "preact",
        "data-astro-cid-wi6vdr2w": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div><div class="surface p-4 lg:col-span-2" data-astro-cid-wi6vdr2w>${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `v2/jobs/${enc}/analytics`,
        "label": job.jobName,
        "options": [
          "MedianEdgeResponseLatency",
          "AvgEdgeResponseLatency",
          "MinEdgeResponseLatency",
          "MaxEdgeResponseLatency"
        ],
        "client:only": "preact",
        "data-astro-cid-wi6vdr2w": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div></div><div class="surface p-2" data-astro-cid-wi6vdr2w>${renderComponent($$result2, "ErrorGraph", null, {
        "endpoint": `v2/jobs/${enc}/erroranalytics`,
        "label": job.jobName,
        "client:only": "preact",
        "data-astro-cid-wi6vdr2w": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph.js",
        "client:component-export": "default"
      })}</div><details id="region-breakdown" class="surface p-4" open data-astro-cid-wi6vdr2w><summary class="cursor-pointer font-semibold text-lg" data-astro-cid-wi6vdr2w>Regional Breakdown</summary>${renderComponent($$result2, "RegionGraphLazy", null, {
        "detailsId": "region-breakdown",
        "jobName": job.internalJobName,
        "label": job.jobName,
        "client:only": "preact",
        "data-astro-cid-wi6vdr2w": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js",
        "client:component-export": "default"
      })}</details><details class="surface p-4" open data-astro-cid-wi6vdr2w><summary class="cursor-pointer font-semibold text-lg" data-astro-cid-wi6vdr2w>Geographic Map</summary><iframe id="jobmapiframe" src="https://jobmap.cloudflare.chaika.me/" width="100%" style="height: 70vh !important;" class="mt-3 rounded-lg" data-astro-cid-wi6vdr2w></iframe></details></main></div><script>(function(){${defineScriptVars({
        quickAnalyticsData,
        job
      })}
		globalThis.jobStats = quickAnalyticsData;
		globalThis.jobData = job;
		globalThis.jobName = job.internalJobName;
	})();<\/script><script src="../assets/js/8.0.7/signalr.min.js"> <\/script><script src="../assets/js/8.0.7/signalr-protocol-msgpack.min.js"> <\/script>${renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro?astro&type=script&index=0&lang.ts")}` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro", void 0);
    $$file6 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro";
    $$url6 = "/job/[...internalJobName]";
    page7 = () => ____internalJobName__exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/locations_DOUAP4v-.mjs
var locations_DOUAP4v_exports = {};
__export(locations_DOUAP4v_exports, {
  page: () => page8
});
var locations_exports, $$Locations, $$file7, $$url7, page8;
var init_locations_DOUAP4v = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/locations_DOUAP4v-.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    locations_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Locations,
      file: () => $$file7,
      url: () => $$url7
    });
    $$Locations = createComponent(async ($$result, $$props, $$slots) => {
      const locResp = await fetch("https://api.bunny.chaika.me/v2/locations");
      let locations = [];
      if (locResp.ok) locations = (await locResp.json()).data ?? [];
      const REGION_ORDER = [
        "NA",
        "EU",
        "AS",
        "OC",
        "SA",
        "AF",
        "ME"
      ];
      const REGION_NAMES = {
        NA: "North America",
        EU: "Europe",
        AS: "Asia-Pacific",
        OC: "Oceania",
        SA: "South America",
        AF: "Africa",
        ME: "Middle East"
      };
      locations.sort((a5, b3) => {
        const ra = a5.friendlyRegionName ?? "";
        const rb = b3.friendlyRegionName ?? "";
        const ri = REGION_ORDER.indexOf(ra) === -1 ? 99 : REGION_ORDER.indexOf(ra);
        const rj = REGION_ORDER.indexOf(rb) === -1 ? 99 : REGION_ORDER.indexOf(rb);
        if (ri !== rj) return ri - rj;
        const pa = (a5.provider ?? "").toLowerCase();
        const pb = (b3.provider ?? "").toLowerCase();
        if (pa < pb) return -1;
        if (pa > pb) return 1;
        if (a5.locationName < b3.locationName) return -1;
        if (a5.locationName > b3.locationName) return 1;
        return 0;
      });
      const regionCount = new Set(locations.map((l4) => l4.friendlyRegionName)).size;
      const grouped = /* @__PURE__ */ new Map();
      for (const loc of locations) {
        const key = loc.friendlyRegionName ?? "Other";
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(loc);
      }
      const orderedGroups = [...grouped.entries()].sort(([a5], [b3]) => {
        return (REGION_ORDER.indexOf(a5) === -1 ? 99 : REGION_ORDER.indexOf(a5)) - (REGION_ORDER.indexOf(b3) === -1 ? 99 : REGION_ORDER.indexOf(b3));
      });
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Locations",
        "description": "Edge agent locations used for Bunny propagation delay and performance monitoring"
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="wrapper stack gap-8"><header><h1 class="text-3xl font-bold">Locations</h1><p class="text-gray-500 mt-1">${locations.length} monitoring agents across ${regionCount} regions</p><p class="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-2xl">These are the distributed monitoring agents used for Bunny propagation-delay and performance monitoring. Each agent polls from its location to detect when a change — such as an Edge Script deployment or DNS update — becomes visible at that edge.</p></header><div class="mb-2"><input id="location-filter" type="text" placeholder="Filter locations..." class="w-full max-w-sm px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-sm"></div><div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"><table class="w-full text-sm border-collapse"><thead><tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"><th class="py-2.5 px-3">IATA</th><th class="py-2.5 px-3">Location</th><th class="py-2.5 px-3">Provider</th><th class="py-2.5 px-3">Active</th></tr></thead><tbody>${orderedGroups.flatMap(([region, locs]) => [renderTemplate`<tr class="region-header bg-gray-100 dark:bg-gray-800"><td colspan="4" class="py-1.5 px-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">${REGION_NAMES[region] ?? region} <span class="font-normal normal-case opacity-60">(${region})</span> &mdash; ${locs.length} location${locs.length !== 1 ? "s" : ""}</td></tr>`, ...locs.map((loc) => renderTemplate`<tr${addAttribute(`${loc.iata}-row`, "id")}${addAttribute(`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!loc.enabled ? "opacity-40" : ""}`, "class")}><td class="py-2 px-3"><span class="font-mono font-bold text-sm">${loc.iata}</span></td><td class="py-2 px-3">${loc.friendlyLocationName ?? loc.locationName}</td><td class="py-2 px-3 text-gray-500 dark:text-gray-400">${loc.provider}</td><td class="py-2 px-3">${loc.enabled ? renderTemplate`<span class="text-green-600 dark:text-green-400 font-semibold">✓</span>` : renderTemplate`<span class="text-gray-400">✗</span>`}</td></tr>`)])}</tbody></table></div></div>` })}${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro", void 0);
    $$file7 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro";
    $$url7 = "/locations";
    page8 = () => locations_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/new-test_CiQORV8B.mjs
var new_test_CiQORV8B_exports = {};
__export(new_test_CiQORV8B_exports, {
  page: () => page9
});
var new_test_exports, $$NewTest, $$file8, $$url8, page9;
var init_new_test_CiQORV8B = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/new-test_CiQORV8B.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    new_test_exports = /* @__PURE__ */ __exportAll({
      default: () => $$NewTest,
      file: () => $$file8,
      prerender: () => false,
      url: () => $$url8
    });
    createAstro("https://astro.build");
    $$NewTest = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$NewTest;
      return renderTemplate`${maybeRenderHead($$result)}<div>Your IP address is: <span class="address">${Astro.clientAddress}</span></div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/new-test.astro", void 0);
    $$file8 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/new-test.astro";
    $$url8 = "/new-test";
    page9 = () => new_test_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/perf_BshqW5nh.mjs
var perf_BshqW5nh_exports = {};
__export(perf_BshqW5nh_exports, {
  page: () => page10
});
var $$PerfTable, perf_exports, $$Perf, $$file9, $$url9, page10;
var init_perf_BshqW5nh = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/perf_BshqW5nh.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_Sparkline_tAhqvrSY();
    init_CategorySection_BzcgLFDU();
    init_jobCategories_NI2Xed_h();
    createAstro("https://astro.build");
    $$PerfTable = createComponent(($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$PerfTable;
      const { groups, stats } = Astro.props;
      function fmtLatency(ms) {
        if (ms == null || isNaN(ms)) return "\u2014";
        if (ms < 1e3) return `${ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms`;
        if (ms < 6e4) return `${(ms / 1e3).toFixed(2)} s`;
        return `${(ms / 6e4).toFixed(2)} min`;
      }
      function p50(jobName, period) {
        const s5 = stats?.find((x4) => x4.job_name?.toLowerCase() === jobName.toLowerCase() && x4.period === period);
        const v4 = s5 ? parseInt(s5.median_run_length) : NaN;
        return isNaN(v4) ? null : v4;
      }
      function nowLatency(job) {
        if (job.currentRunStatus === "API_Error" && job.lastRunStatus === "API_Error") return {
          ms: null,
          apiError: true
        };
        if (job.currentRunStatus === "Deployed") return {
          ms: job.currentRunLengthMs ?? null,
          apiError: false
        };
        return {
          ms: job.lastRunLengthMs ?? job.currentRunLengthMs ?? null,
          apiError: false
        };
      }
      const SORT_LAST = Number.MAX_SAFE_INTEGER;
      function buildParents(jobs) {
        const map = /* @__PURE__ */ new Map();
        for (const job of jobs) {
          const wl = perfVariant(job);
          const v4 = {
            job,
            variantLabel: wl.variantLabel,
            now: nowLatency(job),
            p1: p50(job.internalJobName, "Last 1 Day"),
            p30: p50(job.internalJobName, "Last 30 Days"),
            health: jobHealth(job, false),
            enc: job.internalJobName.replaceAll("/", "%2F")
          };
          let p4 = map.get(wl.parentKey);
          if (!p4) {
            p4 = {
              key: wl.parentKey,
              label: wl.parentLabel,
              provider: wl.provider,
              variants: [],
              rep: v4,
              count: 0,
              health: "good"
            };
            map.set(wl.parentKey, p4);
          }
          p4.variants.push(v4);
        }
        const parents = [...map.values()];
        for (const p4 of parents) {
          p4.variants.sort((a5, b3) => (a5.p1 ?? SORT_LAST) - (b3.p1 ?? SORT_LAST));
          p4.count = p4.variants.length;
          p4.rep = p4.variants[Math.floor((p4.count - 1) / 2)];
          p4.health = p4.variants.some((x4) => x4.health === "bad") ? "bad" : p4.variants.some((x4) => x4.health === "elevated") ? "elevated" : "good";
        }
        parents.sort((a5, b3) => {
          const ga = a5.count > 1 ? 0 : 1;
          const gb = b3.count > 1 ? 0 : 1;
          if (ga !== gb) return ga - gb;
          return (a5.rep.p1 ?? SORT_LAST) - (b3.rep.p1 ?? SORT_LAST);
        });
        return parents;
      }
      function groupDot(jobs) {
        let worst = "good";
        for (const j5 of jobs) {
          const h3 = jobHealth(j5, false);
          if (h3 === "bad") return dotClass("bad");
          if (h3 === "elevated") worst = "elevated";
        }
        return dotClass(worst);
      }
      const built = groups.map((group) => ({
        group,
        parents: buildParents(group.jobs)
      }));
      return renderTemplate`${built.map(({ group, parents }) => renderTemplate`${renderComponent($$result, "CategorySection", $$CategorySection, {
        "name": group.name,
        "count": parents.length,
        "statusColor": groupDot(group.jobs),
        "bodyClass": "pt-2 pb-1",
        "open": true,
        "data-astro-cid-h4uksmkz": true
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="surface overflow-x-auto" data-astro-cid-h4uksmkz><table class="perf-table w-full text-sm" data-astro-cid-h4uksmkz><thead data-astro-cid-h4uksmkz><tr class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700" data-astro-cid-h4uksmkz><th class="px-4 py-2.5 font-medium cursor-pointer select-none" data-sort="name" data-astro-cid-h4uksmkz>Service<span class="sort-ind" data-astro-cid-h4uksmkz></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none" data-sort="provider" data-astro-cid-h4uksmkz>Provider<span class="sort-ind" data-astro-cid-h4uksmkz></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right" data-sort="now" data-astro-cid-h4uksmkz>Now<span class="sort-ind" data-astro-cid-h4uksmkz></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right" data-sort="p50" data-astro-cid-h4uksmkz>p50 · 1d<span class="sort-ind" data-astro-cid-h4uksmkz></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right hidden sm:table-cell" data-sort="p50-30d" data-astro-cid-h4uksmkz>p50 · 30d<span class="sort-ind" data-astro-cid-h4uksmkz></span></th><th class="px-4 py-2.5 font-medium hidden md:table-cell" data-astro-cid-h4uksmkz>7-day trend</th></tr></thead><tbody data-astro-cid-h4uksmkz>${parents.map((p4) => {
        const expandable = p4.count > 1;
        const childNames = p4.variants.map((v4) => `${v4.job.internalJobName} ${v4.variantLabel}`).join(" ");
        const filterName = `${p4.label} ${p4.provider} ${childNames}`.toLowerCase();
        const rep = p4.rep;
        return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<tr${addAttribute(`perf-parent border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 ${expandable ? "cursor-pointer" : ""}`, "class")}${addAttribute(p4.key, "data-key")}${addAttribute(filterName, "data-name")}${addAttribute(p4.provider.toLowerCase(), "data-provider")}${addAttribute(rep.now.ms ?? SORT_LAST, "data-now")}${addAttribute(rep.p1 ?? SORT_LAST, "data-p50")}${addAttribute(rep.p30 ?? SORT_LAST, "data-p50-30d")}${addAttribute(p4.count, "data-count")}${addAttribute(expandable ? "true" : "false", "data-expandable")}${addAttribute(expandable ? "false" : void 0, "aria-expanded")} data-astro-cid-h4uksmkz><td class="px-4 py-2.5" data-astro-cid-h4uksmkz>${expandable ? renderTemplate`<span class="flex items-center gap-2.5" data-astro-cid-h4uksmkz><svg class="chev shrink-0 w-4 h-4 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-h4uksmkz><polyline points="9 18 15 12 9 6" data-astro-cid-h4uksmkz></polyline></svg><span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dotClass(p4.health)}`, "class")}${addAttribute(p4.health, "title")} data-astro-cid-h4uksmkz></span><span class="font-semibold" data-astro-cid-h4uksmkz>${p4.label}</span><span class="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums" data-astro-cid-h4uksmkz>· ${p4.count}</span></span>` : renderTemplate`<a${addAttribute(`/perf/${rep.job.internalJobName}`, "href")} class="flex items-center gap-2.5 group" data-astro-cid-h4uksmkz><span class="w-4 h-4 shrink-0" data-astro-cid-h4uksmkz></span><span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dotClass(p4.health)}`, "class")}${addAttribute(p4.health, "title")} data-astro-cid-h4uksmkz></span><span class="min-w-0" data-astro-cid-h4uksmkz><span class="font-semibold text-[var(--accent-regular)] group-hover:underline" data-astro-cid-h4uksmkz>${p4.label}</span><span class="block text-xs text-gray-500 dark:text-gray-400 truncate" data-astro-cid-h4uksmkz>${rep.variantLabel}</span></span>${rep.job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(rep.job.jobDescription, "title")} data-astro-cid-h4uksmkz>?</span>`}</a>`}</td><td class="px-4 py-2.5" data-astro-cid-h4uksmkz><span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 whitespace-nowrap" data-astro-cid-h4uksmkz>${p4.provider}</span></td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap" data-astro-cid-h4uksmkz>${rep.now.apiError ? renderTemplate`<span class="text-red-600 dark:text-red-400 font-medium" data-astro-cid-h4uksmkz>API Error</span>` : fmtLatency(rep.now.ms)}</td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap font-medium" data-astro-cid-h4uksmkz>${fmtLatency(rep.p1)}${expandable ? renderTemplate`<span class="text-gray-400 dark:text-gray-500 font-normal" data-astro-cid-h4uksmkz> med</span>` : null}</td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap hidden sm:table-cell" data-astro-cid-h4uksmkz>${fmtLatency(rep.p30)}</td><td class="px-4 py-2.5 hidden md:table-cell w-32" data-astro-cid-h4uksmkz>${renderComponent($$result3, "Sparkline", Sparkline, {
          "endpoint": `v2/jobs/${rep.enc}/analytics`,
          "metric": "MedianApiResponseLatency",
          "health": p4.health,
          "days": 7,
          "client:visible": true,
          "data-astro-cid-h4uksmkz": true,
          "client:component-hydration": "visible",
          "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx",
          "client:component-export": "default"
        })}</td></tr>${expandable && p4.variants.map((v4) => renderTemplate`<tr class="perf-child border-b border-gray-100 dark:border-gray-700 bg-black/[0.015] dark:bg-white/[0.02]"${addAttribute(p4.key, "data-key")}${addAttribute(`${v4.job.internalJobName} ${v4.variantLabel} ${p4.label} ${p4.provider}`.toLowerCase(), "data-name")}${addAttribute(v4.now.ms ?? SORT_LAST, "data-now")}${addAttribute(v4.p1 ?? SORT_LAST, "data-p50")}${addAttribute(v4.p30 ?? SORT_LAST, "data-p50-30d")} hidden data-astro-cid-h4uksmkz><td class="px-4 py-2" data-astro-cid-h4uksmkz><a${addAttribute(`/perf/${v4.job.internalJobName}`, "href")} class="flex items-center gap-2.5 group pl-6" data-astro-cid-h4uksmkz><span${addAttribute(`shrink-0 w-2 h-2 rounded-full ${dotClass(v4.health)}`, "class")}${addAttribute(v4.health, "title")} data-astro-cid-h4uksmkz></span><span class="text-gray-700 dark:text-gray-200 group-hover:underline" data-astro-cid-h4uksmkz>${v4.variantLabel}</span>${v4.job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(v4.job.jobDescription, "title")} data-astro-cid-h4uksmkz>?</span>`}</a></td><td class="px-4 py-2" data-astro-cid-h4uksmkz></td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap" data-astro-cid-h4uksmkz>${v4.now.apiError ? renderTemplate`<span class="text-red-600 dark:text-red-400 font-medium" data-astro-cid-h4uksmkz>API Error</span>` : fmtLatency(v4.now.ms)}</td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap" data-astro-cid-h4uksmkz>${fmtLatency(v4.p1)}</td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap hidden sm:table-cell" data-astro-cid-h4uksmkz>${fmtLatency(v4.p30)}</td><td class="px-4 py-2 hidden md:table-cell w-32" data-astro-cid-h4uksmkz>${renderComponent($$result3, "Sparkline", Sparkline, {
          "endpoint": `v2/jobs/${v4.enc}/analytics`,
          "metric": "MedianApiResponseLatency",
          "health": v4.health,
          "days": 7,
          "client:visible": true,
          "data-astro-cid-h4uksmkz": true,
          "client:component-hydration": "visible",
          "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx",
          "client:component-export": "default"
        })}</td></tr>`)}` })}`;
      })}</tbody></table></div>` })}`)}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/PerfTable.astro", void 0);
    perf_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Perf,
      file: () => $$file9,
      url: () => $$url9
    });
    $$Perf = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch("https://api.bunny.chaika.me/v2/jobs/type/Perf")).json()).data;
      };
      var getJobsTask = getJobs();
      const getAnalytics = async () => {
        return await (await fetch("https://api.bunny.chaika.me/v1/quick/QuickAnalytics/type/Perf")).json();
      };
      var getAnalyticsTask = getAnalytics();
      const jobs = await getJobsTask;
      const stats = await getAnalyticsTask;
      const oneWeekAgo = /* @__PURE__ */ new Date(Date.now() - 6048e5);
      const bunnyJobs = jobs.filter((job) => new Date(job.predictedRunTime) >= oneWeekAgo).filter((job) => (job.internalJobName || "").toLowerCase().startsWith("bunny-"));
      const groups = groupJobs(bunnyJobs, "perf");
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Bunny Performance Monitoring",
        "description": "See Bunny performance monitoring jobs."
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20"><main class="wrapper stack gap-8">${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Bunny Performance Jobs",
        "tagline": "Compare the performance of Bunny services, measured from 50+ locations worldwide. Jobs are grouped by workload \u2014 Compute, Object Storage and SQL. Each service shows its median; expand it to see per-region and per-size variants. Sort any column, or click a job for its description and a per-location latency map.",
        "align": "start"
      }, {})}<input id="job-filter" type="text" placeholder="Filter jobs..." class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><div class="stack gap-4">${renderComponent($$result2, "PerfTable", $$PerfTable, {
        "groups": groups,
        "stats": stats
      })}</div>${renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts")}</main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro", void 0);
    $$file9 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro";
    $$url9 = "/perf";
    page10 = () => perf_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._BheOTVi9.mjs
var BheOTVi9_exports = {};
__export(BheOTVi9_exports, {
  page: () => page11
});
var $$JobLocationsTable, ____internalJobName__exports2, $$Component3, $$file10, $$url10, page11;
var init_BheOTVi9 = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_.._BheOTVi9.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_JobDetailHeader_BnxmItwH();
    createAstro("https://astro.build");
    $$JobLocationsTable = createComponent(async ($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$JobLocationsTable;
      const { jobName } = Astro.props;
      const encoded = jobName.replaceAll("/", "%2F");
      let locations = [];
      try {
        const res = await fetch(`https://api.bunny.chaika.me/v2/jobs/${encoded}/locations`);
        if (res.ok) locations = (await res.json()).data ?? [];
      } catch (e4) {
        console.log(`failed to fetch locations for ${jobName}`);
      }
      const rank = (s5) => s5 === "Errored" ? 0 : s5 === "Deployed" ? 2 : 1;
      locations.sort((a5, b3) => rank(a5.currentRunStatus) - rank(b3.currentRunStatus) || a5.locationName.localeCompare(b3.locationName));
      const statusClass = (s5) => s5 === "Deployed" || s5 === "Success" ? "text-green-600" : s5 === "Errored" || s5 === "Failure" ? "text-red-500" : "text-yellow-500";
      const delayTxt = (loc) => {
        const ms = loc.currentRunStatus === "Deployed" || loc.currentRunStatus === "Success" ? loc.currentRunLengthMs : loc.lastRunLengthMs;
        if (ms == null || isNaN(ms)) return "\u2014";
        if (ms < 1e3) return Math.round(ms) + " ms";
        if (ms < 6e4) return (ms / 1e3).toFixed(2) + " s";
        return (ms / 6e4).toFixed(2) + " min";
      };
      const updatedTxt = (loc) => {
        const t4 = loc.responseTimeUtc || loc.currentRunTime || loc.lastRunTime;
        const d4 = t4 ? new Date(t4) : null;
        return d4 && !isNaN(d4.getTime()) ? d4.toLocaleTimeString() : "\u2014";
      };
      const tableId = `loc-table-${jobName.replaceAll(/[^a-zA-Z0-9]/g, "")}`;
      const filterId = `${tableId}-filter`;
      return renderTemplate`${maybeRenderHead($$result)}<div class="surface p-4"><div class="flex items-center justify-between gap-3 mb-3 flex-wrap"><h3 class="font-semibold text-lg">Locations <span class="text-gray text-sm">(${locations.length})</span></h3><input${addAttribute(filterId, "id")} type="text" placeholder="Filter locations..." class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>${locations.length === 0 ? renderTemplate`<div class="text-gray text-sm py-6 text-center">No location data available.</div>` : renderTemplate`<div class="overflow-x-auto"><table${addAttribute(tableId, "id")} class="w-full text-sm"><thead><tr class="text-gray text-xs uppercase border-b border-gray-200 dark:border-gray-700"><th class="text-left font-medium py-2 pr-4">Location</th><th class="text-left font-medium py-2 pr-4">Status</th><th class="text-left font-medium py-2 pr-4">Delay</th><th class="text-left font-medium py-2">Last Updated</th></tr></thead><tbody>${locations.map((loc) => renderTemplate`<tr class="border-b border-gray-100 dark:border-gray-800 loc-row"${addAttribute(loc.locationName.toLowerCase(), "data-loc")}><td class="py-2 pr-4 font-medium break-all">${loc.locationName}</td><td${addAttribute(`py-2 pr-4 ${statusClass(loc.currentRunStatus)}`, "class")}${addAttribute(`loc-status-${loc.locationName}`, "id")}>${loc.currentRunStatus}</td><td class="py-2 pr-4 tabular-nums"${addAttribute(`loc-delay-${loc.locationName}`, "id")}>${delayTxt(loc)}</td><td class="py-2 pr-4 text-gray"${addAttribute(`loc-updated-${loc.locationName}`, "id")}>${updatedTxt(loc)}</td></tr>`)}</tbody></table></div>`}</div><script>(function(){${defineScriptVars({
        filterId,
        tableId
      })}
	const input = document.getElementById(filterId);
	const table = document.getElementById(tableId);
	if (input && table) {
		input.addEventListener("input", () => {
			const q = input.value.toLowerCase();
			table.querySelectorAll(".loc-row").forEach((row) => {
				row.style.display = row.getAttribute("data-loc").includes(q) ? "" : "none";
			});
		});
	}
})();<\/script>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobLocationsTable.astro", void 0);
    ____internalJobName__exports2 = /* @__PURE__ */ __exportAll({
      default: () => $$Component3,
      file: () => $$file10,
      url: () => $$url10
    });
    createAstro("https://astro.build");
    $$Component3 = createComponent(async ($$result, $$props, $$slots) => {
      const Astro = $$result.createAstro($$props, $$slots);
      Astro.self = $$Component3;
      const { internalJobName } = Astro.params;
      const job = (await (await fetch("https://api.bunny.chaika.me/v2/jobs/" + internalJobName)).json()).data;
      const quickAnalyticsResponse = await fetch("https://api.bunny.chaika.me/v1/quick/QuickAnalytics/" + (job.internalJobName ?? job.jobName));
      let quickAnalyticsData = [];
      if (quickAnalyticsResponse.ok) quickAnalyticsData = await quickAnalyticsResponse.json();
      const enc = job.internalJobName;
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": job?.jobName ?? "",
        "description": job?.jobDescription ?? "",
        "data-astro-cid-s3tyleqx": true
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-8" data-astro-cid-s3tyleqx><header class="wrapper stack gap-3" data-astro-cid-s3tyleqx><a class="back-link" href="/perf/" data-astro-cid-s3tyleqx>${renderComponent($$result2, "Icon", $$Icon, {
        "icon": "arrow-left",
        "data-astro-cid-s3tyleqx": true
      })}All Jobs</a>${renderComponent($$result2, "Hero", $$Hero, {
        "title": job?.jobName,
        "align": "start",
        "data-astro-cid-s3tyleqx": true
      }, { "default": ($$result3) => renderTemplate`<p data-astro-cid-s3tyleqx>${job?.jobDescription}</p>` })}${renderComponent($$result2, "JobDetailHeader", $$JobDetailHeader, {
        "job": job,
        "stats": quickAnalyticsData,
        "type": "perf",
        "data-astro-cid-s3tyleqx": true
      })}</header><main class="wrapper stack gap-6" data-astro-cid-s3tyleqx><div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-astro-cid-s3tyleqx><div class="surface p-4" data-astro-cid-s3tyleqx>${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `v2/jobs/${enc}/analytics`,
        "label": job.jobName,
        "options": [
          "MedianRunLength",
          "MinRunLength",
          "MaxRunLength",
          "AvgRunLength"
        ],
        "client:only": "preact",
        "data-astro-cid-s3tyleqx": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div><div class="surface p-4" data-astro-cid-s3tyleqx>${renderComponent($$result2, "SmartGraph", null, {
        "endpoint": `v2/jobs/${enc}/analytics`,
        "label": job.jobName,
        "options": [
          "AvgApiResponseLatency",
          "MedianApiResponseLatency",
          "MinApiResponseLatency",
          "MaxApiResponseLatency"
        ],
        "client:only": "preact",
        "data-astro-cid-s3tyleqx": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js",
        "client:component-export": "default"
      })}</div></div><div class="surface p-2" data-astro-cid-s3tyleqx>${renderComponent($$result2, "ErrorGraph", null, {
        "endpoint": `v2/jobs/${enc}/erroranalytics`,
        "label": job.jobName,
        "client:only": "preact",
        "data-astro-cid-s3tyleqx": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph.js",
        "client:component-export": "default"
      })}</div>${renderComponent($$result2, "JobLocationsTable", $$JobLocationsTable, {
        "jobName": job.internalJobName,
        "data-astro-cid-s3tyleqx": true
      })}<details id="region-breakdown" class="surface p-4" open data-astro-cid-s3tyleqx><summary class="cursor-pointer font-semibold text-lg" data-astro-cid-s3tyleqx>Regional Breakdown</summary>${renderComponent($$result2, "RegionGraphLazy", null, {
        "detailsId": "region-breakdown",
        "jobName": job.internalJobName,
        "label": job.jobName,
        "defaultMetric": "MedianApiResponseLatency",
        "client:only": "preact",
        "data-astro-cid-s3tyleqx": true,
        "client:component-hydration": "only",
        "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js",
        "client:component-export": "default"
      })}</details><details class="surface p-4" open data-astro-cid-s3tyleqx><summary class="cursor-pointer font-semibold text-lg" data-astro-cid-s3tyleqx>Geographic Map</summary><iframe id="jobmapiframe"${addAttribute(`https://perfmap.cloudflare.chaika.me/?${job.internalJobName}`, "src")} width="100%" style="height: 70vh !important;" class="mt-3 rounded-lg" data-astro-cid-s3tyleqx></iframe></details></main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro", void 0);
    $$file10 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro";
    $$url10 = "/perf/[...internalJobName]";
    page11 = () => ____internalJobName__exports2;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/StatusDashboard_D0qGYTwM.mjs
var $$StatusDashboard;
var init_StatusDashboard_D0qGYTwM = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/StatusDashboard_D0qGYTwM.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Sparkline_tAhqvrSY();
    init_jobCategories_NI2Xed_h();
    $$StatusDashboard = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch("https://api.bunny.chaika.me/v2/jobs/type/BunnyDelay")).json()).data;
      };
      const getIncidentsData = async () => {
        return (await (await fetch("https://api.bunny.chaika.me/v2/incidents/type/BunnyDelay")).json()).data;
      };
      const [jobs, incidents] = await Promise.all([getJobs(), getIncidentsData()]);
      function getItemStatus(jobName) {
        const job = jobs.find((j5) => j5.internalJobName === jobName);
        if (!job) return {
          status: "Unknown",
          color: "bg-gray-500",
          time: null
        };
        if (incidents.find((inc) => inc.target === jobName && inc.active)) return {
          status: "Degraded",
          color: "bg-yellow-500",
          time: job.predictedRunTime,
          length: job.predictedDelayLengthMs,
          runStatus: job.predictedRunStatus
        };
        if (job.predictedRunStatus === "API_Error") return {
          status: "API Down",
          color: "bg-red-500",
          time: null,
          length: job.predictedDelayLengthMs,
          runStatus: job.predictedRunStatus
        };
        if (job.type === "delayed") return {
          status: "Delayed",
          color: "bg-orange-500",
          time: job.predictedRunTime,
          length: job.predictedDelayLengthMs,
          runStatus: job.predictedRunStatus
        };
        return {
          status: "Normal",
          color: "bg-green-500",
          time: job.predictedRunTime,
          length: job.predictedDelayLengthMs,
          runStatus: job.predictedRunStatus
        };
      }
      function getGroupStatus(groupItems) {
        return groupItems.some((item) => {
          const job = jobs.find((j5) => j5.internalJobName === item.jobName);
          if (!job) return false;
          if (incidents.find((inc) => inc.target === item.jobName && inc.active)) return true;
          if (job.predictedRunStatus === "API_Error" || job.type === "delayed") return true;
          return false;
        }) ? {
          status: "Partially Degraded",
          color: "bg-yellow-500"
        } : {
          status: "Normal",
          color: "bg-green-500"
        };
      }
      function runLengthDisplayFormat(jobName, ms) {
        if (jobName == "cron") {
          if (ms) ms -= 6e4;
        }
        if (ms == void 0) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) return seconds.toFixed(2) + " second(s)";
        let minutes = seconds / 60;
        if (minutes < 60) return minutes.toFixed(2) + " minute(s)";
        return (minutes / 60).toFixed(2) + " hour(s)";
      }
      function formatTime(date2) {
        if (!date2) return "";
        return new Date(date2).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short"
        });
      }
      function rowHealth(jobName) {
        const job = jobs.find((j5) => j5.internalJobName === jobName);
        if (!job) return "good";
        const hasIncident = incidents.some((inc) => inc.target === jobName && inc.active);
        return jobHealth(job, hasIncident);
      }
      function itemDescription(jobName) {
        return jobs.find((j5) => j5.internalJobName === jobName)?.jobDescription ?? "";
      }
      function buildSummary() {
        const counts = {
          operational: 0,
          delayed: 0,
          degraded: 0,
          apiDown: 0
        };
        for (const group of statusConfig.groups) for (const item of group.items) {
          const s5 = getItemStatus(item.jobName).status;
          if (s5 === "API Down") counts.apiDown++;
          else if (s5 === "Degraded") counts.degraded++;
          else if (s5 === "Delayed") counts.delayed++;
          else if (s5 === "Normal") counts.operational++;
        }
        let health = "good";
        let headline = "All Bunny Systems Normal";
        if (counts.apiDown > 0) {
          health = "bad";
          headline = `${counts.apiDown} Service${counts.apiDown > 1 ? "s" : ""} Reporting API Errors`;
        } else if (counts.degraded > 0) {
          health = "elevated";
          headline = `${counts.degraded} Service${counts.degraded > 1 ? "s" : ""} Degraded`;
        } else if (counts.delayed > 0) {
          health = "elevated";
          headline = `${counts.delayed} Service${counts.delayed > 1 ? "s" : ""} Delayed`;
        }
        return {
          counts,
          health,
          headline
        };
      }
      const summary = buildSummary();
      return renderTemplate`${maybeRenderHead($$result)}<script>(function(){${defineScriptVars({
        jobs,
        config: statusConfig,
        incidents
      })}
  globalThis.jobData = jobs;
  globalThis.config = config;
  globalThis.incidents = incidents;
})();<\/script><div class="surface px-5 py-4 sm:px-6 sm:py-5 mb-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-3"><span${addAttribute(`w-3.5 h-3.5 rounded-full flex-none ${dotClass(summary.health)}`, "class")} id="overall-status-dot"></span><div><h2 class="text-xl font-semibold leading-tight" id="overall-status-headline">${summary.headline}</h2><p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Live propagation-delay monitoring · auto-updating</p></div></div><a id="websocket-conn-status" class="websocket-conn-pill self-start sm:self-auto">Connecting to Live Updates…</a></div><div class="flex flex-wrap gap-2 mt-4"><span${addAttribute(`status-chip status-chip-good ${summary.counts.operational === 0 ? "is-zero" : ""}`, "class")} id="summary-count-operational"><span class="chip-dot"></span>${summary.counts.operational} Operational</span><span${addAttribute(`status-chip status-chip-elevated ${summary.counts.delayed === 0 ? "is-zero" : ""}`, "class")} id="summary-count-delayed"><span class="chip-dot"></span>${summary.counts.delayed} Delayed</span><span${addAttribute(`status-chip status-chip-elevated ${summary.counts.degraded === 0 ? "is-zero" : ""}`, "class")} id="summary-count-degraded"><span class="chip-dot"></span>${summary.counts.degraded} Degraded</span><span${addAttribute(`status-chip status-chip-bad ${summary.counts.apiDown === 0 ? "is-zero" : ""}`, "class")} id="summary-count-apidown"><span class="chip-dot"></span>${summary.counts.apiDown} API Down</span></div></div><div class="space-y-4">${statusConfig.groups.map((group) => {
        const groupStatus = getGroupStatus(group.items);
        return renderTemplate`<div class="surface overflow-hidden"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700"><h2 class="text-lg font-semibold">${group.name}</h2><div class="flex items-center"><span${addAttribute(`w-2.5 h-2.5 rounded-full mr-2 ${groupStatus.color}`, "class")}${addAttribute(`grp-${group.name}-color`, "id")}></span><span class="text-sm font-medium"${addAttribute(`grp-${group.name}-status`, "id")}>${groupStatus.status}</span></div></div><div>${group.items.map((item) => {
          const status = getItemStatus(item.jobName);
          return renderTemplate`<a${addAttribute(`/job/${item.jobName}`, "href")} class="flex items-center justify-between gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-gray-700 last:border-b-0"><span class="flex items-center gap-1.5 min-w-0"><span class="font-medium">${item.name}</span>${itemDescription(item.jobName) && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(itemDescription(item.jobName), "title")}>?</span>`}</span><div class="flex items-center gap-3"><div class="hidden sm:block w-24 md:w-28 flex-none">${renderComponent($$result, "Sparkline", Sparkline, {
            "endpoint": `v2/jobs/${item.jobName}/analytics`,
            "metric": "MedianRunLength",
            "health": rowHealth(item.jobName),
            "days": 7,
            "client:visible": true,
            "client:component-hydration": "visible",
            "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx",
            "client:component-export": "default"
          })}</div><span class="text-sm text-gray-500 dark:text-gray-300 text-right"${addAttribute(`item-${item.jobName}-runLength`, "id")}>${runLengthDisplayFormat(item.jobName, status.length)}</span>${status.time && renderTemplate`<span class="text-sm text-gray-500 dark:text-gray-300 hidden sm:inline"${addAttribute(`item-${item.jobName}-time`, "id")}>${formatTime(status.time)}</span>`}<div class="flex items-center"><span${addAttribute(`w-2.5 h-2.5 rounded-full mr-2 ${status.color}`, "class")}${addAttribute(`item-${item.jobName}-color`, "id")}></span><span class="text-sm font-medium"${addAttribute(`item-${item.jobName}-status`, "id")}>${status.status}</span></div></div></a>`;
        })}</div></div>`;
      })}</div><script src="/assets/js/8.0.7/signalr.min.js"><\/script><script src="/assets/js/8.0.7/signalr-protocol-msgpack.min.js"><\/script>${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro", void 0);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/status_CjnLdbYa.mjs
var status_CjnLdbYa_exports = {};
__export(status_CjnLdbYa_exports, {
  page: () => page12
});
var status_exports, $$Status, $$file11, $$url11, page12;
var init_status_CjnLdbYa = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/status_CjnLdbYa.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_StatusDashboard_D0qGYTwM();
    status_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Status,
      file: () => $$file11,
      url: () => $$url11
    });
    $$Status = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Bunny Delay Monitoring",
        "description": "See Bunny Delay Monitoring Status"
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20"><main class="wrapper stack gap-8">${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Bunny Status",
        "tagline": "We monitor the delay of various updates/operations, and evaluate for potential incidents when they are delayed or have API errors. Click on any item to see more details, including a graph of recent delay times.",
        "align": "start"
      })}${renderComponent($$result2, "StatusDashboard", $$StatusDashboard, {})}</main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro", void 0);
    $$file11 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro";
    $$url11 = "/status";
    page12 = () => status_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/index_DbWUqOgy.mjs
var index_DbWUqOgy_exports = {};
__export(index_DbWUqOgy_exports, {
  page: () => page13
});
var pages_exports, $$Index, $$file12, page13;
var init_index_DbWUqOgy = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/index_DbWUqOgy.mjs"() {
    "use strict";
    init_server_CW5TLezH();
    init_compiler_Cv_Cl9y0();
    init_BaseLayout_Cs9QTFGi();
    init_Hero_C_IngQTh();
    init_StatusDashboard_D0qGYTwM();
    pages_exports = /* @__PURE__ */ __exportAll({
      default: () => $$Index,
      file: () => $$file12,
      url: () => ""
    });
    $$Index = createComponent(($$result, $$props, $$slots) => {
      const sections = [
        {
          label: "Delay Jobs",
          href: "/delay/"
        },
        {
          label: "Performance",
          href: "/perf/"
        },
        {
          label: "Locations",
          href: "/locations/"
        }
      ];
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
        "title": "Action-Delay-API \u2014 Bunny Status",
        "description": "Live propagation-delay status for Bunny configuration changes, measured from 50+ edge locations worldwide.",
        "data-astro-cid-lcdefpme": true
      }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="stack gap-20" data-astro-cid-lcdefpme><main class="wrapper stack gap-8" data-astro-cid-lcdefpme>${renderComponent($$result2, "Hero", $$Hero, {
        "title": "Bunny Status",
        "tagline": "Live propagation delay of Bunny configuration changes \u2014 DNS, Edge Rules, Edge Scripts and more \u2014 measured from 50+ edge locations worldwide. Click any item for a recent-delay graph.",
        "align": "start",
        "data-astro-cid-lcdefpme": true
      })}<nav aria-label="Sections" class="overview-strip" data-astro-cid-lcdefpme>${sections.map((s5) => renderTemplate`<a${addAttribute(s5.href, "href")} class="overview-link" data-astro-cid-lcdefpme>${s5.label}</a>`)}</nav>${renderComponent($$result2, "StatusDashboard", $$StatusDashboard, { "data-astro-cid-lcdefpme": true })}</main></div>` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro", void 0);
    $$file12 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro";
    page13 = () => pages_exports;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/noop-entrypoint_Z3zFhrGC.mjs
var noop_entrypoint_Z3zFhrGC_exports = {};
__export(noop_entrypoint_Z3zFhrGC_exports, {
  server: () => server
});
var server;
var init_noop_entrypoint_Z3zFhrGC = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/noop-entrypoint_Z3zFhrGC.mjs"() {
    "use strict";
    server = {};
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/virtual_astro_middleware.mjs
var virtual_astro_middleware_exports = {};
__export(virtual_astro_middleware_exports, {
  onRequest: () => onRequest
});
var onRequest;
var init_virtual_astro_middleware = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/virtual_astro_middleware.mjs"() {
    "use strict";
    onRequest = (_4, next) => next();
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_virtual_astro_session-driver_C-PI1Pas.mjs
var virtual_astro_session_driver_C_PI1Pas_exports = {};
__export(virtual_astro_session_driver_C_PI1Pas_exports, {
  default: () => _virtual_astro_session_driver_default
});
var _virtual_astro_session_driver_default;
var init_virtual_astro_session_driver_C_PI1Pas = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_virtual_astro_session-driver_C-PI1Pas.mjs"() {
    "use strict";
    _virtual_astro_session_driver_default = null;
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs
var virtual_astro_server_island_manifest_C1Q2srgE_exports = {};
__export(virtual_astro_server_island_manifest_C1Q2srgE_exports, {
  serverIslandMap: () => serverIslandMap,
  serverIslandNameMap: () => serverIslandNameMap
});
var serverIslandMap, serverIslandNameMap;
var init_virtual_astro_server_island_manifest_C1Q2srgE = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs"() {
    "use strict";
    serverIslandMap = /* @__PURE__ */ new Map([]);
    serverIslandNameMap = /* @__PURE__ */ new Map([]);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/astro-adapter_CRVyU_0L.mjs
var astro_adapter_CRVyU_0L_exports = {};
var init_astro_adapter_CRVyU_0L = __esm({
  "../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/chunks/astro-adapter_CRVyU_0L.mjs"() {
    "use strict";
    throw new Error(`Could not resolve "@opentelemetry/api" imported by "@deno/astro-adapter". Is it installed?`);
  }
});

// ../../../../../../../Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/entry.mjs
init_server_CW5TLezH();
init_errors_D7mtj974();
init_remote_NpkQAic();
init_console_DgykGsYt();
init_preact();
var NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  return await next();
};
function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) routes.push({
    ...serializedRoute,
    routeData: deserializeRouteData(serializedRoute.routeData)
  });
  if (routesList) for (const route of routesList?.routes) routes.push({
    file: "",
    links: [],
    scripts: [],
    styles: [],
    routeData: route
  });
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}
var _astro_preact_opts_default = {
  include: void 0,
  exclude: void 0
};
var r4 = "diffed";
var o4 = "__c";
var i4 = "__s";
var a4 = "__c";
var c3 = "__k";
var u4 = "__d";
var s4 = "__s";
var l3 = /[\s\n\\/='"\0<>]/;
var f4 = /^(xlink|xmlns|xml)([A-Z])/;
var p3 = /^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/;
var h$1 = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/;
var d3 = /* @__PURE__ */ new Set(["draggable", "spellcheck"]);
function v3(e4) {
  void 0 !== e4.__g ? e4.__g |= 8 : e4[u4] = true;
}
function m3(e4) {
  void 0 !== e4.__g ? e4.__g &= -9 : e4[u4] = false;
}
function y3(e4) {
  return void 0 !== e4.__g ? !!(8 & e4.__g) : true === e4[u4];
}
var _3 = /["&<]/;
function g4(e4) {
  if (0 === e4.length || false === _3.test(e4)) return e4;
  for (var t4 = 0, n3 = 0, r5 = "", o5 = ""; n3 < e4.length; n3++) {
    switch (e4.charCodeAt(n3)) {
      case 34:
        o5 = "&quot;";
        break;
      case 38:
        o5 = "&amp;";
        break;
      case 60:
        o5 = "&lt;";
        break;
      default:
        continue;
    }
    n3 !== t4 && (r5 += e4.slice(t4, n3)), r5 += o5, t4 = n3 + 1;
  }
  return n3 !== t4 && (r5 += e4.slice(t4, n3)), r5;
}
var b2 = {};
var x3 = /* @__PURE__ */ new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom"
]);
var k3 = /[A-Z]/g;
function w3(e4) {
  var t4 = "";
  for (var n3 in e4) {
    var r5 = e4[n3];
    if (null != r5 && "" !== r5) {
      var o5 = "-" == n3[0] ? n3 : b2[n3] || (b2[n3] = n3.replace(k3, "-$&").toLowerCase()), i5 = ";";
      "number" != typeof r5 || o5.startsWith("--") || x3.has(o5) || (i5 = "px;"), t4 = t4 + o5 + ":" + r5 + i5;
    }
  }
  return t4 || void 0;
}
function C3() {
  this.__d = true;
}
function A4(e4, t4) {
  return {
    __v: e4,
    context: t4,
    props: e4.props,
    setState: C3,
    forceUpdate: C3,
    __d: true,
    __h: new Array(0)
  };
}
function S2(e4, t4, n3) {
  if (!e4.s) {
    if (n3 instanceof L2) {
      if (!n3.s) return void (n3.o = S2.bind(null, e4, t4));
      1 & t4 && (t4 = n3.s), n3 = n3.v;
    }
    if (n3 && n3.then) return void n3.then(S2.bind(null, e4, t4), S2.bind(null, e4, 2));
    e4.s = t4, e4.v = n3;
    const r5 = e4.o;
    r5 && r5(e4);
  }
}
var L2 = /* @__PURE__ */ (function() {
  function e4() {
  }
  return e4.prototype.then = function(t4, n3) {
    var r5 = new e4(), o5 = this.s;
    if (o5) {
      var i5 = 1 & o5 ? t4 : n3;
      if (i5) {
        try {
          S2(r5, 1, i5(this.v));
        } catch (e5) {
          S2(r5, 2, e5);
        }
        return r5;
      }
      return this;
    }
    return this.o = function(e5) {
      try {
        var o6 = e5.v;
        1 & e5.s ? S2(r5, 1, t4 ? t4(o6) : o6) : n3 ? S2(r5, 1, n3(o6)) : S2(r5, 2, o6);
      } catch (e6) {
        S2(r5, 2, e6);
      }
    }, r5;
  }, e4;
})();
function E3(e4) {
  return e4 instanceof L2 && 1 & e4.s;
}
function j4(e4, t4, n3) {
  for (var r5; ; ) {
    var o5 = e4();
    if (E3(o5) && (o5 = o5.v), !o5) return i5;
    if (o5.then) {
      r5 = 0;
      break;
    }
    var i5 = n3();
    if (i5 && i5.then) {
      if (!E3(i5)) {
        r5 = 1;
        break;
      }
      i5 = i5.s;
    }
    if (t4) {
      var a5 = t4();
      if (a5 && a5.then && !E3(a5)) {
        r5 = 2;
        break;
      }
    }
  }
  var c4 = new L2(), u5 = S2.bind(null, c4, 2);
  return (0 === r5 ? o5.then(l4) : 1 === r5 ? i5.then(s5) : a5.then(f5)).then(void 0, u5), c4;
  function s5(r6) {
    i5 = r6;
    do {
      if (t4 && (a5 = t4()) && a5.then && !E3(a5)) return void a5.then(f5).then(void 0, u5);
      if (!(o5 = e4()) || E3(o5) && !o5.v) return void S2(c4, 1, i5);
      if (o5.then) return void o5.then(l4).then(void 0, u5);
      E3(i5 = n3()) && (i5 = i5.v);
    } while (!i5 || !i5.then);
    i5.then(s5).then(void 0, u5);
  }
  function l4(e5) {
    e5 ? (i5 = n3()) && i5.then ? i5.then(s5).then(void 0, u5) : s5(i5) : S2(c4, 1, i5);
  }
  function f5() {
    (o5 = e4()) ? o5.then ? o5.then(l4).then(void 0, u5) : l4(o5) : S2(c4, 1, i5);
  }
}
function T4(e4, t4) {
  try {
    var n3 = e4();
  } catch (e5) {
    return t4(true, e5);
  }
  return n3 && n3.then ? n3.then(t4.bind(null, false), t4.bind(null, true)) : t4(false, n3);
}
var D3;
var P4;
var $2;
var U3;
var Z = function(a5, u5) {
  try {
    var s5 = l[i4];
    l[i4] = true, D3 = l.__b, P4 = l[r4], $2 = l.__r, U3 = l.unmount;
    var l4 = k(S, null);
    return l4[c3] = [a5], Promise.resolve(T4(function() {
      return Promise.resolve(R2(a5, u5 || F3, false, void 0, l4, true, void 0)).then(function(e4) {
        var t4, n3 = (function() {
          if (W4(e4)) {
            var n4 = function() {
              var e5 = o5.join(H4);
              return t4 = 1, e5;
            }, r5 = 0, o5 = e4, i5 = j4(function() {
              return !!o5.some(function(e5) {
                return e5 && "function" == typeof e5.then;
              }) && r5++ < 25;
            }, void 0, function() {
              return Promise.resolve(Promise.all(o5)).then(function(e5) {
                o5 = e5.flat();
              });
            });
            return i5 && i5.then ? i5.then(n4) : n4();
          }
        })();
        return n3 && n3.then ? n3.then(function(n4) {
          return t4 ? n4 : e4;
        }) : t4 ? n3 : e4;
      });
    }, function(t4, n3) {
      if (l[o4] && l[o4](a5, M3), l[i4] = s5, M3.length = 0, t4) throw n3;
      return n3;
    }));
  } catch (e4) {
    return Promise.reject(e4);
  }
};
var F3 = {};
var M3 = [];
var W4 = Array.isArray;
var z3 = Object.assign;
var H4 = "";
var N2 = "<!--$s-->";
var q4 = "<!--/$s-->";
function B4(e4) {
  return "string" == typeof e4 ? N2 + e4 + q4 : W4(e4) ? (e4.unshift(N2), e4.push(q4), e4) : e4 && "function" == typeof e4.then ? e4.then(B4) : N2 + e4 + q4;
}
function O3(e4, t4) {
  var n3, r5 = e4.type, o5 = true;
  return e4[a4] ? (o5 = false, (n3 = e4[a4]).state = n3[s4]) : n3 = new r5(e4.props, t4), e4[a4] = n3, n3.__v = e4, n3.props = e4.props, n3.context = t4, v3(n3), n3.state ?? (n3.state = F3), n3[s4] ?? (n3[s4] = n3.state), r5.getDerivedStateFromProps ? n3.state = z3({}, n3.state, r5.getDerivedStateFromProps(n3.props, n3.state)) : o5 && n3.componentWillMount ? (n3.componentWillMount(), n3.state = n3[s4] !== n3.state ? n3[s4] : n3.state) : !o5 && n3.componentWillUpdate && n3.componentWillUpdate(), $2 && $2(e4), n3.render(n3.props, n3.state, t4);
}
function R2(t4, r5, o5, i5, u5, _4, b3) {
  if (null == t4 || true === t4 || false === t4 || t4 === H4) return H4;
  var x4 = typeof t4;
  if ("object" != x4) return "function" == x4 ? H4 : "string" == x4 ? g4(t4) : t4 + H4;
  if (W4(t4)) {
    var k4, C4 = H4;
    u5[c3] = t4;
    for (var S3 = t4.length, L3 = 0; L3 < S3; L3++) {
      var E4 = t4[L3];
      if (null != E4 && "boolean" != typeof E4) {
        var j5, T5 = R2(E4, r5, o5, i5, u5, _4, b3);
        "string" == typeof T5 ? C4 += T5 : (k4 || (k4 = new Array(S3)), C4 && k4.push(C4), C4 = H4, W4(T5) ? (j5 = k4).push.apply(j5, T5) : k4.push(T5));
      }
    }
    return k4 ? (C4 && k4.push(C4), k4) : C4;
  }
  if (void 0 !== t4.constructor) return H4;
  t4.__ = u5, D3 && D3(t4);
  var Z2 = t4.type, M4 = t4.props;
  if ("function" == typeof Z2) {
    var N3, q5, I2, K3 = r5;
    if (Z2 === S) {
      if ("tpl" in M4) {
        for (var G3 = H4, Q3 = 0; Q3 < M4.tpl.length; Q3++) if (G3 += M4.tpl[Q3], M4.exprs && Q3 < M4.exprs.length) {
          var X3 = M4.exprs[Q3];
          if (null == X3) continue;
          "object" != typeof X3 || void 0 !== X3.constructor && !W4(X3) ? G3 += X3 : G3 += R2(X3, r5, o5, i5, t4, _4, b3);
        }
        return G3;
      }
      if ("UNSTABLE_comment" in M4) return "<!--" + g4(M4.UNSTABLE_comment) + "-->";
      q5 = M4.children;
    } else {
      if (null != (N3 = Z2.contextType)) {
        var Y = r5[N3.__c];
        K3 = Y ? Y.props.value : N3.__;
      }
      var ee = Z2.prototype && "function" == typeof Z2.prototype.render;
      if (ee) q5 = O3(t4, K3), I2 = t4[a4];
      else {
        t4[a4] = I2 = A4(t4, K3);
        for (var te = 0; y3(I2) && te++ < 25; ) {
          m3(I2), $2 && $2(t4);
          try {
            q5 = Z2.call(I2, M4, K3);
          } catch (e4) {
            throw _4 && e4 && "function" == typeof e4.then && (t4._suspended = true), e4;
          }
        }
        v3(I2);
      }
      if (null != I2.getChildContext && (r5 = z3({}, r5, I2.getChildContext())), ee && l.errorBoundaries && (Z2.getDerivedStateFromError || I2.componentDidCatch)) {
        q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5;
        try {
          return R2(q5, r5, o5, i5, t4, _4, false);
        } catch (e4) {
          return Z2.getDerivedStateFromError && (I2[s4] = Z2.getDerivedStateFromError(e4)), I2.componentDidCatch && I2.componentDidCatch(e4, F3), y3(I2) ? (q5 = O3(t4, r5), null != (I2 = t4[a4]).getChildContext && (r5 = z3({}, r5, I2.getChildContext())), R2(q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5, r5, o5, i5, t4, _4, b3)) : H4;
        } finally {
          P4 && P4(t4), U3 && U3(t4);
        }
      }
    }
    q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5;
    try {
      var ne = R2(q5, r5, o5, i5, t4, _4, b3);
      return P4 && P4(t4), l.unmount && l.unmount(t4), t4._suspended ? B4(ne) : ne;
    } catch (n3) {
      if (!_4 && b3 && b3.onError) {
        var re = (function e4(n4) {
          return b3.onError(n4, t4, function(t5, n5) {
            try {
              return R2(t5, r5, o5, i5, n5, _4, b3);
            } catch (t6) {
              return e4(t6);
            }
          });
        })(n3);
        if (void 0 !== re) return re;
        var oe = l.__e;
        return oe && oe(n3, t4), H4;
      }
      if (!_4) throw n3;
      if (!n3 || "function" != typeof n3.then) throw n3;
      return n3.then(function e4() {
        try {
          var n4 = R2(q5, r5, o5, i5, t4, _4, b3);
          return t4._suspended ? B4(n4) : n4;
        } catch (t5) {
          if (!t5 || "function" != typeof t5.then) throw t5;
          return t5.then(e4);
        }
      });
    }
  }
  var ie, ae = "<" + Z2, ce = H4;
  for (var ue in M4) {
    var se = M4[ue];
    if ("function" != typeof (se = J3(se) ? se.value : se) || "class" === ue || "className" === ue) {
      switch (ue) {
        case "children":
          ie = se;
          continue;
        case "key":
        case "ref":
        case "__self":
        case "__source":
          continue;
        case "htmlFor":
          if ("for" in M4) continue;
          ue = "for";
          break;
        case "className":
          if ("class" in M4) continue;
          ue = "class";
          break;
        case "defaultChecked":
          ue = "checked";
          break;
        case "defaultSelected":
          ue = "selected";
          break;
        case "defaultValue":
        case "value":
          switch (ue = "value", Z2) {
            case "textarea":
              ie = se;
              continue;
            case "select":
              i5 = se;
              continue;
            case "option":
              i5 != se || "selected" in M4 || (ae += " selected");
          }
          break;
        case "dangerouslySetInnerHTML":
          ce = se && se.__html;
          continue;
        case "style":
          "object" == typeof se && (se = w3(se));
          break;
        case "acceptCharset":
          ue = "accept-charset";
          break;
        case "httpEquiv":
          ue = "http-equiv";
          break;
        default:
          if (l3.test(ue)) continue;
          f4.test(ue) ? ue = ue.replace(f4, "$1:$2").toLowerCase() : "-" !== ue[4] && !d3.has(ue) || null == se ? o5 ? h$1.test(ue) && (ue = "panose1" === ue ? "panose-1" : ue.replace(/([A-Z])/g, "-$1").toLowerCase()) : p3.test(ue) && (ue = ue.toLowerCase()) : se += H4;
      }
      null != se && false !== se && (ae = true === se || se === H4 ? ae + " " + ue : ae + " " + ue + '="' + ("string" == typeof se ? g4(se) : se + H4) + '"');
    }
  }
  if (l3.test(Z2)) throw new Error(Z2 + " is not a valid HTML tag name in " + ae + ">");
  if (ce || ("string" == typeof ie ? ce = g4(ie) : null != ie && false !== ie && true !== ie && (ce = R2(ie, r5, "svg" === Z2 || "foreignObject" !== Z2 && o5, i5, t4, _4, b3))), P4 && P4(t4), U3 && U3(t4), !ce && V3.has(Z2)) return ae + "/>";
  var le = "</" + Z2 + ">", fe = ae + ">";
  return W4(ce) ? [fe].concat(ce, [le]) : "string" != typeof ce ? [
    fe,
    ce,
    le
  ] : fe + ce + le;
}
var V3 = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function J3(e4) {
  return null !== e4 && "object" == typeof e4 && "function" == typeof e4.peek && "value" in e4;
}
var contexts = /* @__PURE__ */ new WeakMap();
function getContext(result) {
  if (contexts.has(result)) return contexts.get(result);
  let ctx = {
    c: 0,
    islandCount: 0,
    get id() {
      return "p" + this.c.toString();
    },
    signals: /* @__PURE__ */ new Map(),
    propsToSignals: /* @__PURE__ */ new Map()
  };
  contexts.set(result, ctx);
  return ctx;
}
function incrementId(ctx) {
  let id = ctx.id;
  ctx.c++;
  return id;
}
function incrementIslandId(ctx) {
  const islandId = ctx.islandCount;
  ctx.islandCount++;
  return islandId;
}
function isSignal(x4) {
  return x4 != null && typeof x4 === "object" && typeof x4.peek === "function" && "value" in x4;
}
function restoreSignalsOnProps(ctx, props) {
  let propMap;
  if (ctx.propsToSignals.has(props)) propMap = ctx.propsToSignals.get(props);
  else {
    propMap = /* @__PURE__ */ new Map();
    ctx.propsToSignals.set(props, propMap);
  }
  for (const [key, signal] of propMap) props[key] = signal;
  return propMap;
}
function serializeSignals(ctx, props, attrs, map) {
  const signals = {};
  for (const [key, value] of Object.entries(props)) {
    const isPropArray = Array.isArray(value);
    const isPropObject = !isSignal(value) && typeof props[key] === "object" && props[key] !== null && !isPropArray;
    if (isPropObject || isPropArray) (isPropObject ? Object.keys(props[key]) : value).forEach((valueKey, valueIndex) => {
      const signal = isPropObject ? props[key][valueKey] : valueKey;
      if (isSignal(signal)) {
        const keyOrIndex = isPropObject ? valueKey.toString() : valueIndex;
        props[key] = isPropObject ? Object.assign({}, props[key], { [keyOrIndex]: signal.peek() }) : props[key].map((v4, i5) => i5 === valueIndex ? [signal.peek(), i5] : v4);
        const currentMap = map.get(key) || [];
        map.set(key, [...currentMap, [signal, keyOrIndex]]);
        const currentSignals = signals[key] || [];
        signals[key] = [...currentSignals, [getSignalId(ctx, signal), keyOrIndex]];
      }
    });
    else if (isSignal(value)) {
      props[key] = value.peek();
      map.set(key, value);
      signals[key] = getSignalId(ctx, value);
    }
  }
  if (Object.keys(signals).length) attrs["data-preact-signals"] = JSON.stringify(signals);
}
function getSignalId(ctx, item) {
  let id = ctx.signals.get(item);
  if (!id) {
    id = incrementId(ctx);
    ctx.signals.set(item, id);
  }
  return id;
}
var StaticHtml = ({ value, name, hydrate = true }) => {
  if (!value) return null;
  return k(hydrate ? "astro-slot" : "astro-static-slot", {
    name,
    dangerouslySetInnerHTML: { __html: value }
  });
};
StaticHtml.shouldComponentUpdate = () => false;
var static_html_default = StaticHtml;
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var WIN_SLASH = "\\\\/";
  var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
  var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
  var DOT_LITERAL = "\\.";
  var PLUS_LITERAL = "\\+";
  var QMARK_LITERAL = "\\?";
  var SLASH_LITERAL = "\\/";
  var ONE_CHAR = "(?=.)";
  var QMARK = "[^/]";
  var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
  var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
  var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
  var POSIX_CHARS = {
    DOT_LITERAL,
    PLUS_LITERAL,
    QMARK_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    QMARK,
    END_ANCHOR,
    DOTS_SLASH,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
    NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
    QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
    STAR: `${QMARK}*?`,
    START_ANCHOR,
    SEP: "/"
  };
  var WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: `[${WIN_SLASH}]`,
    QMARK: WIN_NO_SLASH,
    STAR: `${WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
    END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
    SEP: "\\"
  };
  module.exports = {
    DEFAULT_MAX_EXTGLOB_RECURSION,
    MAX_LENGTH: 65536,
    POSIX_REGEX_SOURCE: {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    },
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      __proto__: null,
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    /**
    * Create EXTGLOB_CHARS
    */
    extglobChars(chars) {
      return {
        "!": {
          type: "negate",
          open: "(?:(?!(?:",
          close: `))${chars.STAR})`
        },
        "?": {
          type: "qmark",
          open: "(?:",
          close: ")?"
        },
        "+": {
          type: "plus",
          open: "(?:",
          close: ")+"
        },
        "*": {
          type: "star",
          open: "(?:",
          close: ")*"
        },
        "@": {
          type: "at",
          open: "(?:",
          close: ")"
        }
      };
    },
    /**
    * Create GLOB_CHARS
    */
    globChars(win32) {
      return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
    }
  };
}));
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
  var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports.isWindows = () => {
    if (typeof navigator !== "undefined" && navigator.platform) {
      const platform = navigator.platform.toLowerCase();
      return platform === "win32" || platform === "windows";
    }
    if (typeof process !== "undefined" && process.platform) return process.platform === "win32";
    return false;
  };
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1) return input;
    if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state = {}) => {
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
    if (state.negated === true) output = `(?:^(?!${output}).*$)`;
    return output;
  };
  exports.basename = (path, { windows } = {}) => {
    const segs = path.split(windows ? /[\\/]/ : "/");
    const last = segs[segs.length - 1];
    if (last === "") return segs[segs.length - 2];
    return last;
  };
}));
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var utils = require_utils();
  var { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
  var isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  };
  var depth = (token) => {
    if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
  };
  var scan = (input, options) => {
    const opts = options || {};
    const length = input.length - 1;
    const scanToEnd = opts.parts === true || opts.scanToEnd === true;
    const slashes = [];
    const tokens = [];
    const parts = [];
    let str = input;
    let index = -1;
    let start2 = 0;
    let lastIndex = 0;
    let isBrace = false;
    let isBracket = false;
    let isGlob = false;
    let isExtglob = false;
    let isGlobstar = false;
    let braceEscaped = false;
    let backslashes = false;
    let negated = false;
    let negatedExtglob = false;
    let finished = false;
    let braces = 0;
    let prev;
    let code;
    let token = {
      value: "",
      depth: 0,
      isGlob: false
    };
    const eos = () => index >= length;
    const peek = () => str.charCodeAt(index + 1);
    const advance = () => {
      prev = code;
      return str.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        backslashes = token.backslashes = true;
        code = advance();
        if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
        continue;
      }
      if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) continue;
            break;
          }
          if (braceEscaped !== true && code === CHAR_COMMA) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) continue;
            break;
          }
          if (code === CHAR_RIGHT_CURLY_BRACE) {
            braces--;
            if (braces === 0) {
              braceEscaped = false;
              isBrace = token.isBrace = true;
              finished = true;
              break;
            }
          }
        }
        if (scanToEnd === true) continue;
        break;
      }
      if (code === CHAR_FORWARD_SLASH) {
        slashes.push(index);
        tokens.push(token);
        token = {
          value: "",
          depth: 0,
          isGlob: false
        };
        if (finished === true) continue;
        if (prev === CHAR_DOT && index === start2 + 1) {
          start2 += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (opts.noext !== true) {
        if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          isExtglob = token.isExtglob = true;
          finished = true;
          if (code === CHAR_EXCLAMATION_MARK && index === start2) negatedExtglob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                isGlob = token.isGlob = true;
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
      }
      if (code === CHAR_ASTERISK) {
        if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) continue;
        break;
      }
      if (code === CHAR_QUESTION_MARK) {
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) continue;
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (eos() !== true && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isBracket = token.isBracket = true;
            isGlob = token.isGlob = true;
            finished = true;
            break;
          }
        }
        if (scanToEnd === true) continue;
        break;
      }
      if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start2) {
        negated = token.negated = true;
        start2++;
        continue;
      }
      if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_LEFT_PARENTHESES) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES) {
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
      if (isGlob === true) {
        finished = true;
        if (scanToEnd === true) continue;
        break;
      }
    }
    if (opts.noext === true) {
      isExtglob = false;
      isGlob = false;
    }
    let base = str;
    let prefix = "";
    let glob = "";
    if (start2 > 0) {
      prefix = str.slice(0, start2);
      str = str.slice(start2);
      lastIndex -= start2;
    }
    if (base && isGlob === true && lastIndex > 0) {
      base = str.slice(0, lastIndex);
      glob = str.slice(lastIndex);
    } else if (isGlob === true) {
      base = "";
      glob = str;
    } else base = str;
    if (base && base !== "" && base !== "/" && base !== str) {
      if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
    }
    if (opts.unescape === true) {
      if (glob) glob = utils.removeBackslashes(glob);
      if (base && backslashes === true) base = utils.removeBackslashes(base);
    }
    const state = {
      prefix,
      input,
      start: start2,
      base,
      glob,
      isBrace,
      isBracket,
      isGlob,
      isExtglob,
      isGlobstar,
      negated,
      negatedExtglob
    };
    if (opts.tokens === true) {
      state.maxDepth = 0;
      if (!isPathSeparator(code)) tokens.push(token);
      state.tokens = tokens;
    }
    if (opts.parts === true || opts.tokens === true) {
      let prevIndex;
      for (let idx = 0; idx < slashes.length; idx++) {
        const n3 = prevIndex ? prevIndex + 1 : start2;
        const i5 = slashes[idx];
        const value = input.slice(n3, i5);
        if (opts.tokens) {
          if (idx === 0 && start2 !== 0) {
            tokens[idx].isPrefix = true;
            tokens[idx].value = prefix;
          } else tokens[idx].value = value;
          depth(tokens[idx]);
          state.maxDepth += tokens[idx].depth;
        }
        if (idx !== 0 || value !== "") parts.push(value);
        prevIndex = i5;
      }
      if (prevIndex && prevIndex + 1 < input.length) {
        const value = input.slice(prevIndex + 1);
        parts.push(value);
        if (opts.tokens) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
      }
      state.slashes = slashes;
      state.parts = parts;
    }
    return state;
  };
  module.exports = scan;
}));
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var constants = require_constants();
  var utils = require_utils();
  var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
  var expandRange = (args, options) => {
    if (typeof options.expandRange === "function") return options.expandRange(...args, options);
    args.sort();
    const value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v4) => utils.escapeRegex(v4)).join("..");
    }
    return value;
  };
  var syntaxError = (type, char) => {
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
  };
  var splitTopLevel = (input) => {
    const parts = [];
    let bracket = 0;
    let paren = 0;
    let quote = 0;
    let value = "";
    let escaped = false;
    for (const ch of input) {
      if (escaped === true) {
        value += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        value += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        quote = quote === 1 ? 0 : 1;
        value += ch;
        continue;
      }
      if (quote === 0) {
        if (ch === "[") bracket++;
        else if (ch === "]" && bracket > 0) bracket--;
        else if (bracket === 0) {
          if (ch === "(") paren++;
          else if (ch === ")" && paren > 0) paren--;
          else if (ch === "|" && paren === 0) {
            parts.push(value);
            value = "";
            continue;
          }
        }
      }
      value += ch;
    }
    parts.push(value);
    return parts;
  };
  var isPlainBranch = (branch) => {
    let escaped = false;
    for (const ch of branch) {
      if (escaped === true) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (/[?*+@!()[\]{}]/.test(ch)) return false;
    }
    return true;
  };
  var normalizeSimpleBranch = (branch) => {
    let value = branch.trim();
    let changed = true;
    while (changed === true) {
      changed = false;
      if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
        value = value.slice(2, -1);
        changed = true;
      }
    }
    if (!isPlainBranch(value)) return;
    return value.replace(/\\(.)/g, "$1");
  };
  var hasRepeatedCharPrefixOverlap = (branches) => {
    const values = branches.map(normalizeSimpleBranch).filter(Boolean);
    for (let i5 = 0; i5 < values.length; i5++) for (let j5 = i5 + 1; j5 < values.length; j5++) {
      const a5 = values[i5];
      const b3 = values[j5];
      const char = a5[0];
      if (!char || a5 !== char.repeat(a5.length) || b3 !== char.repeat(b3.length)) continue;
      if (a5 === b3 || a5.startsWith(b3) || b3.startsWith(a5)) return true;
    }
    return false;
  };
  var parseRepeatedExtglob = (pattern, requireEnd = true) => {
    if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
    let bracket = 0;
    let paren = 0;
    let quote = 0;
    let escaped = false;
    for (let i5 = 1; i5 < pattern.length; i5++) {
      const ch = pattern[i5];
      if (escaped === true) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        quote = quote === 1 ? 0 : 1;
        continue;
      }
      if (quote === 1) continue;
      if (ch === "[") {
        bracket++;
        continue;
      }
      if (ch === "]" && bracket > 0) {
        bracket--;
        continue;
      }
      if (bracket > 0) continue;
      if (ch === "(") {
        paren++;
        continue;
      }
      if (ch === ")") {
        paren--;
        if (paren === 0) {
          if (requireEnd === true && i5 !== pattern.length - 1) return;
          return {
            type: pattern[0],
            body: pattern.slice(2, i5),
            end: i5
          };
        }
      }
    }
  };
  var getStarExtglobSequenceOutput = (pattern) => {
    let index = 0;
    const chars = [];
    while (index < pattern.length) {
      const match = parseRepeatedExtglob(pattern.slice(index), false);
      if (!match || match.type !== "*") return;
      const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
      if (branches.length !== 1) return;
      const branch = normalizeSimpleBranch(branches[0]);
      if (!branch || branch.length !== 1) return;
      chars.push(branch);
      index += match.end + 1;
    }
    if (chars.length < 1) return;
    return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
  };
  var repeatedExtglobRecursion = (pattern) => {
    let depth = 0;
    let value = pattern.trim();
    let match = parseRepeatedExtglob(value);
    while (match) {
      depth++;
      value = match.body.trim();
      match = parseRepeatedExtglob(value);
    }
    return depth;
  };
  var analyzeRepeatedExtglob = (body, options) => {
    if (options.maxExtglobRecursion === false) return { risky: false };
    const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
    const branches = splitTopLevel(body).map((branch) => branch.trim());
    if (branches.length > 1) {
      if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
    }
    for (const branch of branches) {
      const safeOutput = getStarExtglobSequenceOutput(branch);
      if (safeOutput) return {
        risky: true,
        safeOutput
      };
      if (repeatedExtglobRecursion(branch) > max) return { risky: true };
    }
    return { risky: false };
  };
  var parse3 = (input, options) => {
    if (typeof input !== "string") throw new TypeError("Expected a string");
    input = REPLACEMENTS[input] || input;
    const opts = { ...options };
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    const bos = {
      type: "bos",
      value: "",
      output: opts.prepend || ""
    };
    const tokens = [bos];
    const capture = opts.capture ? "" : "?:";
    const PLATFORM_CHARS = constants.globChars(opts.windows);
    const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
    const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
    const globstar = (opts2) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const nodot = opts.dot ? "" : NO_DOT;
    const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    let star = opts.bash === true ? globstar(opts) : STAR;
    if (opts.capture) star = `(${star})`;
    if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
    const state = {
      input,
      index: -1,
      start: 0,
      dot: opts.dot === true,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: false,
      negated: false,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: false,
      tokens
    };
    input = utils.removePrefix(input, state);
    len = input.length;
    const extglobs = [];
    const braces = [];
    const stack = [];
    let prev = bos;
    let value;
    const eos = () => state.index === len - 1;
    const peek = state.peek = (n3 = 1) => input[state.index + n3];
    const advance = state.advance = () => input[++state.index] || "";
    const remaining = () => input.slice(state.index + 1);
    const consume = (value2 = "", num = 0) => {
      state.consumed += value2;
      state.index += num;
    };
    const append = (token) => {
      state.output += token.output != null ? token.output : token.value;
      consume(token.value);
    };
    const negate = () => {
      let count = 1;
      while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
        advance();
        state.start++;
        count++;
      }
      if (count % 2 === 0) return false;
      state.negated = true;
      state.start++;
      return true;
    };
    const increment = (type) => {
      state[type]++;
      stack.push(type);
    };
    const decrement = (type) => {
      state[type]--;
      stack.pop();
    };
    const push = (tok) => {
      if (prev.type === "globstar") {
        const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
        const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "star";
          prev.value = "*";
          prev.output = star;
          state.output += prev.output;
        }
      }
      if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
      if (tok.value || tok.output) append(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.output = (prev.output || prev.value) + tok.value;
        prev.value += tok.value;
        return;
      }
      tok.prev = prev;
      tokens.push(tok);
      prev = tok;
    };
    const extglobOpen = (type, value2) => {
      const token = {
        ...EXTGLOB_CHARS[value2],
        conditions: 1,
        inner: ""
      };
      token.prev = prev;
      token.parens = state.parens;
      token.output = state.output;
      token.startIndex = state.index;
      token.tokensIndex = tokens.length;
      const output = (opts.capture ? "(" : "") + token.open;
      increment("parens");
      push({
        type,
        value: value2,
        output: state.output ? "" : ONE_CHAR
      });
      push({
        type: "paren",
        extglob: true,
        value: advance(),
        output
      });
      extglobs.push(token);
    };
    const extglobClose = (token) => {
      const literal = input.slice(token.startIndex, state.index + 1);
      const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
      if ((token.type === "plus" || token.type === "star") && analysis.risky) {
        const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
        const open2 = tokens[token.tokensIndex];
        open2.type = "text";
        open2.value = literal;
        open2.output = safeOutput || utils.escapeRegex(literal);
        for (let i5 = token.tokensIndex + 1; i5 < tokens.length; i5++) {
          tokens[i5].value = "";
          tokens[i5].output = "";
          delete tokens[i5].suffix;
        }
        state.output = token.output + open2.output;
        state.backtrack = true;
        push({
          type: "paren",
          extglob: true,
          value,
          output: ""
        });
        decrement("parens");
        return;
      }
      let output = token.close + (opts.capture ? ")" : "");
      let rest;
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
        if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
        if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse3(rest, {
          ...options,
          fastpaths: false
        }).output})${extglobStar})`;
        if (token.prev.type === "bos") state.negatedExtglob = true;
      }
      push({
        type: "paren",
        extglob: true,
        value,
        output
      });
      decrement("parens");
    };
    if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = false;
      let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m4, esc2, chars, first, rest, index) => {
        if (first === "\\") {
          backslashes = true;
          return m4;
        }
        if (first === "?") {
          if (esc2) return esc2 + first + (rest ? QMARK.repeat(rest.length) : "");
          if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
          return QMARK.repeat(chars.length);
        }
        if (first === ".") return DOT_LITERAL.repeat(chars.length);
        if (first === "*") {
          if (esc2) return esc2 + first + (rest ? star : "");
          return star;
        }
        return esc2 ? m4 : `\\${m4}`;
      });
      if (backslashes === true) {
        if (opts.unescape === true) output = output.replace(/\\/g, "");
        else output = output.replace(/\\+/g, (m4) => {
          return m4.length % 2 === 0 ? "\\\\" : m4 ? "\\" : "";
        });
      }
      if (output === input && opts.contains === true) {
        state.output = input;
        return state;
      }
      state.output = utils.wrapOutput(output, state, options);
      return state;
    }
    while (!eos()) {
      value = advance();
      if (value === "\0") continue;
      if (value === "\\") {
        const next = peek();
        if (next === "/" && opts.bash !== true) continue;
        if (next === "." || next === ";") continue;
        if (!next) {
          value += "\\";
          push({
            type: "text",
            value
          });
          continue;
        }
        const match = /^\\+/.exec(remaining());
        let slashes = 0;
        if (match && match[0].length > 2) {
          slashes = match[0].length;
          state.index += slashes;
          if (slashes % 2 !== 0) value += "\\";
        }
        if (opts.unescape === true) value = advance();
        else value += advance();
        if (state.brackets === 0) {
          push({
            type: "text",
            value
          });
          continue;
        }
      }
      if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== false && value === ":") {
          const inner = prev.value.slice(1);
          if (inner.includes("[")) {
            prev.posix = true;
            if (inner.includes(":")) {
              const idx = prev.value.lastIndexOf("[");
              const pre = prev.value.slice(0, idx);
              const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
              if (posix) {
                prev.value = pre + posix;
                state.backtrack = true;
                advance();
                if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
        if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
        if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
        prev.value += value;
        append({ value });
        continue;
      }
      if (state.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value);
        prev.value += value;
        append({ value });
        continue;
      }
      if (value === '"') {
        state.quotes = state.quotes === 1 ? 0 : 1;
        if (opts.keepQuotes === true) push({
          type: "text",
          value
        });
        continue;
      }
      if (value === "(") {
        increment("parens");
        push({
          type: "paren",
          value
        });
        continue;
      }
      if (value === ")") {
        if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
        const extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({
          type: "paren",
          value,
          output: state.parens ? ")" : "\\)"
        });
        decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === true || !remaining().includes("]")) {
          if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
          value = `\\${value}`;
        } else increment("brackets");
        push({
          type: "bracket",
          value
        });
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({
            type: "text",
            value,
            output: `\\${value}`
          });
          continue;
        }
        if (state.brackets === 0) {
          if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
          push({
            type: "text",
            value,
            output: `\\${value}`
          });
          continue;
        }
        decrement("brackets");
        const prevValue = prev.value.slice(1);
        if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
        prev.value += value;
        append({ value });
        if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
        const escaped = utils.escapeRegex(prev.value);
        state.output = state.output.slice(0, -prev.value.length);
        if (opts.literalBrackets === true) {
          state.output += escaped;
          prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`;
        state.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== true) {
        increment("braces");
        const open2 = {
          type: "brace",
          value,
          output: "(",
          outputIndex: state.output.length,
          tokensIndex: state.tokens.length
        };
        braces.push(open2);
        push(open2);
        continue;
      }
      if (value === "}") {
        const brace = braces[braces.length - 1];
        if (opts.nobrace === true || !brace) {
          push({
            type: "text",
            value,
            output: value
          });
          continue;
        }
        let output = ")";
        if (brace.dots === true) {
          const arr = tokens.slice();
          const range = [];
          for (let i5 = arr.length - 1; i5 >= 0; i5--) {
            tokens.pop();
            if (arr[i5].type === "brace") break;
            if (arr[i5].type !== "dots") range.unshift(arr[i5].value);
          }
          output = expandRange(range, opts);
          state.backtrack = true;
        }
        if (brace.comma !== true && brace.dots !== true) {
          const out = state.output.slice(0, brace.outputIndex);
          const toks = state.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{";
          value = output = "\\}";
          state.output = out;
          for (const t4 of toks) state.output += t4.output || t4.value;
        }
        push({
          type: "brace",
          value,
          output
        });
        decrement("braces");
        braces.pop();
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
        push({
          type: "text",
          value
        });
        continue;
      }
      if (value === ",") {
        let output = value;
        const brace = braces[braces.length - 1];
        if (brace && stack[stack.length - 1] === "braces") {
          brace.comma = true;
          output = "|";
        }
        push({
          type: "comma",
          value,
          output
        });
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state.index === state.start + 1) {
          state.start = state.index + 1;
          state.consumed = "";
          state.output = "";
          tokens.pop();
          prev = bos;
          continue;
        }
        push({
          type: "slash",
          value,
          output: SLASH_LITERAL
        });
        continue;
      }
      if (value === ".") {
        if (state.braces > 0 && prev.type === "dot") {
          if (prev.value === ".") prev.output = DOT_LITERAL;
          const brace = braces[braces.length - 1];
          prev.type = "dots";
          prev.output += value;
          prev.value += value;
          brace.dots = true;
          continue;
        }
        if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
          push({
            type: "text",
            value,
            output: DOT_LITERAL
          });
          continue;
        }
        push({
          type: "dot",
          value,
          output: DOT_LITERAL
        });
        continue;
      }
      if (value === "?") {
        if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && prev.type === "paren") {
          const next = peek();
          let output = value;
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
          push({
            type: "text",
            value,
            output
          });
          continue;
        }
        if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
          push({
            type: "qmark",
            value,
            output: QMARK_NO_DOT
          });
          continue;
        }
        push({
          type: "qmark",
          value,
          output: QMARK
        });
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== true && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== true && state.index === 0) {
          negate();
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && prev.value === "(" || opts.regex === false) {
          push({
            type: "plus",
            value,
            output: PLUS_LITERAL
          });
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
          push({
            type: "plus",
            value
          });
          continue;
        }
        push({
          type: "plus",
          value: PLUS_LITERAL
        });
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          push({
            type: "at",
            extglob: true,
            value,
            output: ""
          });
          continue;
        }
        push({
          type: "text",
          value
        });
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^") value = `\\${value}`;
        const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        if (match) {
          value += match[0];
          state.index += match[0].length;
        }
        push({
          type: "text",
          value
        });
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === true)) {
        prev.type = "star";
        prev.star = true;
        prev.value += value;
        prev.output = star;
        state.backtrack = true;
        state.globstar = true;
        consume(value);
        continue;
      }
      let rest = remaining();
      if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === true) {
          consume(value);
          continue;
        }
        const prior = prev.prev;
        const before = prior.prev;
        const isStart = prior.type === "slash" || prior.type === "bos";
        const afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
          push({
            type: "star",
            value,
            output: ""
          });
          continue;
        }
        const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
        const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({
            type: "star",
            value,
            output: ""
          });
          continue;
        }
        while (rest.slice(0, 3) === "/**") {
          const after = input[state.index + 4];
          if (after && after !== "/") break;
          rest = rest.slice(3);
          consume("/**", 3);
        }
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar";
          prev.value += value;
          prev.output = globstar(opts);
          state.output = prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
          prev.value += value;
          state.globstar = true;
          state.output += prior.output + prev.output;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
          const end = rest[1] !== void 0 ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
          prev.value += value;
          state.output += prior.output + prev.output;
          state.globstar = true;
          consume(value + advance());
          push({
            type: "slash",
            value: "/",
            output: ""
          });
          continue;
        }
        if (prior.type === "bos" && rest[0] === "/") {
          prev.type = "globstar";
          prev.value += value;
          prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
          state.output = prev.output;
          state.globstar = true;
          consume(value + advance());
          push({
            type: "slash",
            value: "/",
            output: ""
          });
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "globstar";
        prev.output = globstar(opts);
        prev.value += value;
        state.output += prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      const token = {
        type: "star",
        value,
        output: star
      };
      if (opts.bash === true) {
        token.output = ".*?";
        if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
        token.output = value;
        push(token);
        continue;
      }
      if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot") {
          state.output += NO_DOT_SLASH;
          prev.output += NO_DOT_SLASH;
        } else if (opts.dot === true) {
          state.output += NO_DOTS_SLASH;
          prev.output += NO_DOTS_SLASH;
        } else {
          state.output += nodot;
          prev.output += nodot;
        }
        if (peek() !== "*") {
          state.output += ONE_CHAR;
          prev.output += ONE_CHAR;
        }
      }
      push(token);
    }
    while (state.brackets > 0) {
      if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "[");
      decrement("brackets");
    }
    while (state.parens > 0) {
      if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "(");
      decrement("parens");
    }
    while (state.braces > 0) {
      if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{");
      decrement("braces");
    }
    if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
      type: "maybe_slash",
      value: "",
      output: `${SLASH_LITERAL}?`
    });
    if (state.backtrack === true) {
      state.output = "";
      for (const token of state.tokens) {
        state.output += token.output != null ? token.output : token.value;
        if (token.suffix) state.output += token.suffix;
      }
    }
    return state;
  };
  parse3.fastpaths = (input, options) => {
    const opts = { ...options };
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    const len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    input = REPLACEMENTS[input] || input;
    const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(opts.windows);
    const nodot = opts.dot ? NO_DOTS : NO_DOT;
    const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
    const capture = opts.capture ? "" : "?:";
    const state = {
      negated: false,
      prefix: ""
    };
    let star = opts.bash === true ? ".*?" : STAR;
    if (opts.capture) star = `(${star})`;
    const globstar = (opts2) => {
      if (opts2.noglobstar === true) return star;
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str) => {
      switch (str) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          const match = /^(.*?)\.(\w+)$/.exec(str);
          if (!match) return;
          const source2 = create(match[1]);
          if (!source2) return;
          return source2 + DOT_LITERAL + match[2];
        }
      }
    };
    let source = create(utils.removePrefix(input, state));
    if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
    return source;
  };
  module.exports = parse3;
}));
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
  var scan = require_scan();
  var parse3 = require_parse();
  var utils = require_utils();
  var constants = require_constants();
  var isObject2 = (val) => val && typeof val === "object" && !Array.isArray(val);
  var picomatch = (glob, options, returnState = false) => {
    if (Array.isArray(glob)) {
      const fns = glob.map((input) => picomatch(input, options, returnState));
      const arrayMatcher = (str) => {
        for (const isMatch of fns) {
          const state2 = isMatch(str);
          if (state2) return state2;
        }
        return false;
      };
      return arrayMatcher;
    }
    const isState = isObject2(glob) && glob.tokens && glob.input;
    if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
    const opts = options || {};
    const posix = opts.windows;
    const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
    const state = regex.state;
    delete regex.state;
    let isIgnored = () => false;
    if (opts.ignore) {
      const ignoreOpts = {
        ...options,
        ignore: null,
        onMatch: null,
        onResult: null
      };
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false) => {
      const { isMatch, match, output } = picomatch.test(input, regex, options, {
        glob,
        posix
      });
      const result = {
        glob,
        state,
        regex,
        posix,
        input,
        output,
        match,
        isMatch
      };
      if (typeof opts.onResult === "function") opts.onResult(result);
      if (isMatch === false) {
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function") opts.onIgnore(result);
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (typeof opts.onMatch === "function") opts.onMatch(result);
      return returnObject ? result : true;
    };
    if (returnState) matcher.state = state;
    return matcher;
  };
  picomatch.test = (input, regex, options, { glob, posix } = {}) => {
    if (typeof input !== "string") throw new TypeError("Expected input to be a string");
    if (input === "") return {
      isMatch: false,
      output: ""
    };
    const opts = options || {};
    const format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match = input === glob;
    let output = match && format ? format(input) : input;
    if (match === false) {
      output = format ? format(input) : input;
      match = output === glob;
    }
    if (match === false || opts.capture === true) {
      if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
      else match = regex.exec(output);
    }
    return {
      isMatch: Boolean(match),
      match,
      output
    };
  };
  picomatch.matchBase = (input, glob, options) => {
    return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(utils.basename(input));
  };
  picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  picomatch.parse = (pattern, options) => {
    if (Array.isArray(pattern)) return pattern.map((p4) => picomatch.parse(p4, options));
    return parse3(pattern, {
      ...options,
      fastpaths: false
    });
  };
  picomatch.scan = (input, options) => scan(input, options);
  picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
    if (returnOutput === true) return state.output;
    const opts = options || {};
    const prepend = opts.contains ? "" : "^";
    const append = opts.contains ? "" : "$";
    let source = `${prepend}(?:${state.output})${append}`;
    if (state && state.negated === true) source = `^(?!${source}).*$`;
    const regex = picomatch.toRegex(source, options);
    if (returnState === true) regex.state = state;
    return regex;
  };
  picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
    if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
    let parsed = {
      negated: false,
      fastpaths: true
    };
    if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse3.fastpaths(input, options);
    if (!parsed.output) parsed = parse3(input, options);
    return picomatch.compileRe(parsed, options, returnOutput, returnState);
  };
  picomatch.toRegex = (source, options) => {
    try {
      const opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && options.debug === true) throw err;
      return /$^/;
    }
  };
  picomatch.constants = constants;
  module.exports = picomatch;
}));
var import_picomatch = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
  var pico = require_picomatch$1();
  var utils = require_utils();
  function picomatch(glob, options, returnState = false) {
    if (options && (options.windows === null || options.windows === void 0)) options = {
      ...options,
      windows: utils.isWindows()
    };
    return pico(glob, options, returnState);
  }
  Object.assign(picomatch, pico);
  module.exports = picomatch;
})))(), 1);
function ensureArray(thing) {
  if (Array.isArray(thing)) return thing;
  if (thing == null) return [];
  return [thing];
}
function toMatcher(pattern) {
  if (pattern instanceof RegExp) return pattern;
  const normalized = slash(pattern);
  const fn = (0, import_picomatch.default)(normalized, { dot: true });
  return { test: (what) => fn(what) };
}
function createFilter(include, exclude) {
  const includeMatchers = ensureArray(include).map(toMatcher);
  const excludeMatchers = ensureArray(exclude).map(toMatcher);
  if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
  return function(id) {
    if (typeof id !== "string") return false;
    if (id.includes("\0")) return false;
    const pathId = slash(id);
    for (const matcher of excludeMatchers) {
      if (matcher instanceof RegExp) matcher.lastIndex = 0;
      if (matcher.test(pathId)) return false;
    }
    for (const matcher of includeMatchers) {
      if (matcher instanceof RegExp) matcher.lastIndex = 0;
      if (matcher.test(pathId)) return true;
    }
    return !includeMatchers.length;
  };
}
var slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_4, w4) => w4.toUpperCase());
var originalConsoleError;
var consoleFilterRefs = 0;
var filter = _astro_preact_opts_default?.include || _astro_preact_opts_default?.exclude ? createFilter(_astro_preact_opts_default.include, _astro_preact_opts_default.exclude) : null;
function setVNodeMask(vNode, mask) {
  vNode._mask = mask;
  vNode.__m = mask;
}
async function check(Component$1, props, children, metadata) {
  if (typeof Component$1 !== "function") return false;
  if (Component$1.name === "QwikComponent") return false;
  const componentUrl = metadata?.componentUrl;
  if (filter && componentUrl && !filter(componentUrl)) return false;
  if (Component$1.prototype != null && typeof Component$1.prototype.render === "function") return C.isPrototypeOf(Component$1);
  useConsoleFilter();
  try {
    const { html } = await renderToStaticMarkup.call(this, Component$1, props, children, void 0);
    if (typeof html !== "string") return false;
    return html === "" ? false : !html.includes("<undefined>");
  } catch {
    return false;
  } finally {
    finishUsingConsoleFilter();
  }
}
function shouldHydrate(metadata) {
  return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  const ctx = getContext(this.result);
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = k(static_html_default, {
      hydrate: shouldHydrate(metadata),
      value,
      name
    });
  }
  let propsMap = restoreSignalsOnProps(ctx, props);
  const newProps = {
    ...props,
    ...slots
  };
  const attrs = {};
  serializeSignals(ctx, props, attrs, propsMap);
  const islandId = incrementIslandId(ctx);
  attrs["data-preact-island-id"] = islandId.toString();
  const vNode = k(Component, newProps, children != null ? k(static_html_default, {
    hydrate: shouldHydrate(metadata),
    value: children
  }) : children);
  setVNodeMask(vNode, [islandId, 0]);
  return {
    attrs,
    html: await Z(vNode)
  };
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && !process.env.ASTRO_INTERNAL_TEST_DISABLE_CONSOLE_FILTER && typeof msg === "string") {
    if (msg.includes("Invalid hook call.") && (msg.includes("https://reactjs.org/link/invalid-hook-call") || msg.includes("https://react.dev/link/invalid-hook-call"))) return;
  }
  originalConsoleError(msg, ...rest);
}
var renderers = [Object.assign({
  "name": "@astrojs/preact",
  "clientEntrypoint": "@astrojs/preact/client.js",
  "serverEntrypoint": "@astrojs/preact/server.js"
}, { ssr: {
  name: "@astrojs/preact",
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true
} })];
[
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "type": "page",
      "component": "_server-islands.astro",
      "params": ["name"],
      "segments": [[{
        "content": "_server-islands",
        "dynamic": false,
        "spread": false
      }], [{
        "content": "name",
        "dynamic": true,
        "spread": false
      }]],
      "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
      "prerender": false,
      "isIndex": false,
      "fallbackRoutes": [],
      "route": "/_server-islands/[name]",
      "origin": "internal",
      "distURL": [],
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/_image",
      "component": "node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js",
      "params": [],
      "pathname": "/_image",
      "pattern": "^\\/_image\\/?$",
      "segments": [[{
        "content": "_image",
        "dynamic": false,
        "spread": false
      }]],
      "type": "endpoint",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "isIndex": false,
      "origin": "internal",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/404",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/404\\/?$",
      "segments": [[{
        "content": "404",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/404.astro",
      "pathname": "/404",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/about",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/about\\/?$",
      "segments": [[{
        "content": "about",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/about.astro",
      "pathname": "/about",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/delay/overview",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/delay\\/overview\\/?$",
      "segments": [[{
        "content": "delay",
        "dynamic": false,
        "spread": false
      }], [{
        "content": "overview",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/delay/overview.astro",
      "pathname": "/delay/overview",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/delay",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/delay\\/?$",
      "segments": [[{
        "content": "delay",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/delay.astro",
      "pathname": "/delay",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/graph/[...type]",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/graph(?:\\/(.*?))?\\/?$",
      "segments": [[{
        "content": "graph",
        "dynamic": false,
        "spread": false
      }], [{
        "content": "...type",
        "dynamic": true,
        "spread": true
      }]],
      "params": ["...type"],
      "component": "src/pages/graph/[...type].astro",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/job/[...internalJobName]",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/job(?:\\/(.*?))?\\/?$",
      "segments": [[{
        "content": "job",
        "dynamic": false,
        "spread": false
      }], [{
        "content": "...internalJobName",
        "dynamic": true,
        "spread": true
      }]],
      "params": ["...internalJobName"],
      "component": "src/pages/job/[...internalJobName].astro",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/locations",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/locations\\/?$",
      "segments": [[{
        "content": "locations",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/locations.astro",
      "pathname": "/locations",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/new-test",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/new-test\\/?$",
      "segments": [[{
        "content": "new-test",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/new-test.astro",
      "pathname": "/new-test",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/perf",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/perf\\/?$",
      "segments": [[{
        "content": "perf",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/perf.astro",
      "pathname": "/perf",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/perf/[...internalJobName]",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/perf(?:\\/(.*?))?\\/?$",
      "segments": [[{
        "content": "perf",
        "dynamic": false,
        "spread": false
      }], [{
        "content": "...internalJobName",
        "dynamic": true,
        "spread": true
      }]],
      "params": ["...internalJobName"],
      "component": "src/pages/perf/[...internalJobName].astro",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/status",
      "isIndex": false,
      "type": "page",
      "pattern": "^\\/status\\/?$",
      "segments": [[{
        "content": "status",
        "dynamic": false,
        "spread": false
      }]],
      "params": [],
      "component": "src/pages/status.astro",
      "pathname": "/status",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  },
  {
    "file": "",
    "links": [],
    "scripts": [],
    "styles": [],
    "routeData": {
      "route": "/",
      "isIndex": true,
      "type": "page",
      "pattern": "^\\/$",
      "segments": [],
      "params": [],
      "component": "src/pages/index.astro",
      "pathname": "/",
      "prerender": false,
      "fallbackRoutes": [],
      "distURL": [],
      "origin": "project",
      "_meta": { "trailingSlash": "ignore" }
    }
  }
].map(deserializeRouteInfo);
var _page0 = () => Promise.resolve().then(() => (init_generic_DdU7CG9U(), generic_DdU7CG9U_exports)).then((n3) => n3.t);
var _page1 = () => Promise.resolve().then(() => (init_mfDJ_7q(), mfDJ_7q_exports));
var _page2 = () => Promise.resolve().then(() => (init_about_OFiu2w6j(), about_OFiu2w6j_exports));
var _page3 = () => Promise.resolve().then(() => (init_overview_DSHxjtA8(), overview_DSHxjtA8_exports));
var _page4 = () => Promise.resolve().then(() => (init_delay_BwpMe9sD(), delay_BwpMe9sD_exports));
var _page5 = () => Promise.resolve().then(() => (init_CCxHbg8w(), CCxHbg8w_exports));
var _page6 = () => Promise.resolve().then(() => (init_CcE_1gzU(), CcE_1gzU_exports));
var _page7 = () => Promise.resolve().then(() => (init_locations_DOUAP4v(), locations_DOUAP4v_exports));
var _page8 = () => Promise.resolve().then(() => (init_new_test_CiQORV8B(), new_test_CiQORV8B_exports));
var _page9 = () => Promise.resolve().then(() => (init_perf_BshqW5nh(), perf_BshqW5nh_exports));
var _page10 = () => Promise.resolve().then(() => (init_BheOTVi9(), BheOTVi9_exports));
var _page11 = () => Promise.resolve().then(() => (init_status_CjnLdbYa(), status_CjnLdbYa_exports));
var _page12 = () => Promise.resolve().then(() => (init_index_DbWUqOgy(), index_DbWUqOgy_exports));
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/about.astro", _page2],
  ["src/pages/delay/overview.astro", _page3],
  ["src/pages/delay.astro", _page4],
  ["src/pages/graph/[...type].astro", _page5],
  ["src/pages/job/[...internalJobName].astro", _page6],
  ["src/pages/locations.astro", _page7],
  ["src/pages/new-test.astro", _page8],
  ["src/pages/perf.astro", _page9],
  ["src/pages/perf/[...internalJobName].astro", _page10],
  ["src/pages/status.astro", _page11],
  ["src/pages/index.astro", _page12]
]);
var _manifest = deserializeManifest({ "rootDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/", "cacheDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.astro/", "outDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/", "srcDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/", "publicDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/public/", "buildClientDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/client/", "buildServerDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/", "adapterName": "@deno/astro-adapter", "assetsDir": "_astro", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }], "routeData": { "route": "/404", "isIndex": false, "type": "page", "pattern": "^\\/404\\/?$", "segments": [[{ "content": "404", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/404.astro", "pathname": "/404", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.about[data-astro-cid-ta2fbyqs]{flex-direction:column;gap:3.5rem;display:flex}img[data-astro-cid-ta2fbyqs]{box-shadow:var(--elevation-md);border-radius:1.5rem;margin-top:1.5rem}section[data-astro-cid-ta2fbyqs]{color:var(--gray-200);flex-direction:column;gap:.5rem;display:flex}.section-title[data-astro-cid-ta2fbyqs]{font-size:var(--fs-xl);color:var(--gray-0);grid-column-start:1}.content[data-astro-cid-ta2fbyqs]{grid-column:2/4}.content[data-astro-cid-ta2fbyqs] a{text-underline-offset:.25em;transition:text-decoration-color var(--theme-transition);text-decoration:underline 1px #0000}.content[data-astro-cid-ta2fbyqs] a:hover,.content[data-astro-cid-ta2fbyqs] a:focus{text-decoration-color:currentColor}@media (width>=50em){.about[data-astro-cid-ta2fbyqs]{grid-template-columns:1fr 60% 1fr;display:grid}.about[data-astro-cid-ta2fbyqs]>:first-child{grid-column-start:2}section[data-astro-cid-ta2fbyqs]{font-size:var(--fs-lg);display:contents}}\n" }], "routeData": { "route": "/about", "isIndex": false, "type": "page", "pattern": "^\\/about\\/?$", "segments": [[{ "content": "about", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/about.astro", "pathname": "/about", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }], "routeData": { "route": "/delay/overview", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/overview\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }], [{ "content": "overview", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay/overview.astro", "pathname": "/delay/overview", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.card[data-astro-cid-mxodym6o]{background:var(--gradient-subtle);border:1px solid var(--gray-800);height:11rem;box-shadow:var(--elevation-sm);font-family:var(--font-brand);font-size:var(--fs-lg);transition:box-shadow var(--theme-transition);border-radius:.75rem;grid-template:auto 1fr/auto 1fr;font-weight:500;text-decoration:none;display:grid;overflow:hidden}.card[data-astro-cid-mxodym6o]:hover{box-shadow:var(--elevation-md)}.title[data-astro-cid-mxodym6o]{z-index:1;background:var(--gray-999);color:var(--gray-200);border-radius:.375rem;grid-area:1/1/2/2;margin:.5rem;padding:.5rem 1rem}img[data-astro-cid-mxodym6o]{object-fit:cover;grid-area:1/1/3/3;width:100%;height:100%}@media (width>=50em){.card[data-astro-cid-mxodym6o]{border-radius:1.5rem;height:22rem}.title[data-astro-cid-mxodym6o]{border-radius:.9375rem}}.grid[data-astro-cid-yvqpge4l]{grid-auto-rows:1fr;gap:1rem;padding:0;list-style:none;display:grid}.grid[data-astro-cid-yvqpge4l].small{grid-template-columns:1fr 1fr;gap:1.5rem}.grid[data-astro-cid-yvqpge4l].small>:last-child:nth-child(odd){grid-column:1/3}@media (width>=75em){.grid[data-astro-cid-yvqpge4l]{grid-template-columns:1fr 1fr 1fr;gap:4rem}.grid[data-astro-cid-yvqpge4l].offset{--row-offset:7.5rem;padding-bottom:var(--row-offset)}.grid[data-astro-cid-yvqpge4l].offset>:nth-child(odd){transform:translateY(var(--row-offset))}.grid[data-astro-cid-yvqpge4l].offset>:last-child:nth-child(odd){grid-column:2/3;transform:none}.grid[data-astro-cid-yvqpge4l].small{flex-wrap:wrap;justify-content:center;gap:2rem;display:flex}.grid[data-astro-cid-yvqpge4l].small>*{flex-basis:20rem}}\n.category-section[data-astro-cid-yipa6tc6]{margin-block:0}.category-section[data-astro-cid-yipa6tc6][open]>summary[data-astro-cid-yipa6tc6] .chevron[data-astro-cid-yipa6tc6]{transform:rotate(180deg)}.category-section[data-astro-cid-yipa6tc6]>summary[data-astro-cid-yipa6tc6]{list-style:none}.category-section[data-astro-cid-yipa6tc6]>summary[data-astro-cid-yipa6tc6]::-webkit-details-marker{display:none}\n" }], "routeData": { "route": "/delay", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay.astro", "pathname": "/delay", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [], "routeData": { "route": "/graph/[...type]", "isIndex": false, "type": "page", "pattern": "^\\/graph(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "graph", "dynamic": false, "spread": false }], [{ "content": "...type", "dynamic": true, "spread": true }]], "params": ["...type"], "component": "src/pages/graph/[...type].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.back-link[data-astro-cid-wi6vdr2w]{display:none}@media (width>=50em){.back-link[data-astro-cid-wi6vdr2w]{align-self:flex-start;display:block}}\n" }], "routeData": { "route": "/job/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/job(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "job", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/job/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }], "routeData": { "route": "/locations", "isIndex": false, "type": "page", "pattern": "^\\/locations\\/?$", "segments": [[{ "content": "locations", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/locations.astro", "pathname": "/locations", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [], "routeData": { "route": "/new-test", "isIndex": false, "type": "page", "pattern": "^\\/new-test\\/?$", "segments": [[{ "content": "new-test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/new-test.astro", "pathname": "/new-test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.category-section[data-astro-cid-yipa6tc6]{margin-block:0}.category-section[data-astro-cid-yipa6tc6][open]>summary[data-astro-cid-yipa6tc6] .chevron[data-astro-cid-yipa6tc6]{transform:rotate(180deg)}.category-section[data-astro-cid-yipa6tc6]>summary[data-astro-cid-yipa6tc6]{list-style:none}.category-section[data-astro-cid-yipa6tc6]>summary[data-astro-cid-yipa6tc6]::-webkit-details-marker{display:none}\n.perf-table[data-astro-cid-h4uksmkz] th[data-astro-cid-h4uksmkz][data-sort]{white-space:nowrap}.perf-table[data-astro-cid-h4uksmkz] th[data-astro-cid-h4uksmkz] .sort-ind[data-astro-cid-h4uksmkz]{text-align:left;opacity:.9;width:.9em;display:inline-block}.perf-table[data-astro-cid-h4uksmkz] tr[data-astro-cid-h4uksmkz].perf-parent[aria-expanded=true] .chev[data-astro-cid-h4uksmkz]{transform:rotate(90deg)}\n" }], "routeData": { "route": "/perf", "isIndex": false, "type": "page", "pattern": "^\\/perf\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/perf.astro", "pathname": "/perf", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.back-link[data-astro-cid-s3tyleqx]{display:none}@media (width>=50em){.back-link[data-astro-cid-s3tyleqx]{align-self:flex-start;display:block}}\n" }], "routeData": { "route": "/perf/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/perf(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/perf/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n" }], "routeData": { "route": "/status", "isIndex": false, "type": "page", "pattern": "^\\/status\\/?$", "segments": [[{ "content": "status", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/status.astro", "pathname": "/status", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.Dwipeu-R.js" }], "styles": [{ "type": "external", "src": "_astro/BaseLayout.D2nCt-Qx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-lg);text-align:center}.title[data-astro-cid-ge2uvauf],.tagline[data-astro-cid-ge2uvauf]{margin-inline:auto}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-3xl);color:var(--gray-0)}@media (width>=50em){.hero[data-astro-cid-ge2uvauf]{font-size:var(--fs-xl)}.start[data-astro-cid-ge2uvauf]{text-align:start}.start[data-astro-cid-ge2uvauf] .title[data-astro-cid-ge2uvauf],.start[data-astro-cid-ge2uvauf] .tagline[data-astro-cid-ge2uvauf]{margin-inline:unset}.title[data-astro-cid-ge2uvauf]{font-size:var(--fs-5xl)}}\n.overview-strip[data-astro-cid-lcdefpme]{flex-wrap:wrap;gap:.5rem;display:flex}.overview-link[data-astro-cid-lcdefpme]{border:1px solid var(--gray-800);background-color:var(--gray-999_40);color:var(--gray-100);font-size:var(--fs-sm);transition:border-color var(--theme-transition), color var(--theme-transition), background-color var(--theme-transition);border-radius:999rem;align-items:center;padding:.4rem .9rem;font-weight:500;text-decoration:none;display:inline-flex}.overview-link[data-astro-cid-lcdefpme]:hover{border-color:var(--accent-regular);color:var(--accent-regular)}\n" }], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }], "serverLike": true, "middlewareMode": "classic", "base": "/", "trailingSlash": "ignore", "compressHTML": "jsx", "componentMetadata": [["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "\0noop-middleware": "virtual_astro_middleware.mjs", "\0virtual:astro:server-island-manifest": "chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs", "\0virtual:astro:session-driver": "chunks/_virtual_astro_session-driver_C-PI1Pas.mjs", "\0virtual:astro:actions/noop-entrypoint": "chunks/noop-entrypoint_Z3zFhrGC.mjs", "@deno/astro-adapter/server.ts": "entry.mjs", "\0virtual:astro:page:src/pages/404@_@astro": "chunks/404_1mfDJ-7q.mjs", "\0virtual:astro:page:src/pages/perf/[...internalJobName]@_@astro": "chunks/_.._BheOTVi9.mjs", "\0virtual:astro:page:src/pages/graph/[...type]@_@astro": "chunks/_.._CCxHbg8w.mjs", "\0virtual:astro:page:src/pages/job/[...internalJobName]@_@astro": "chunks/_.._CcE-1gzU.mjs", "\0virtual:astro:page:src/pages/about@_@astro": "chunks/about_OFiu2w6j.mjs", "__vite-optional-peer-dep:@opentelemetry/api:@deno/astro-adapter": "chunks/astro-adapter_CRVyU_0L.mjs", "\0virtual:astro:page:src/pages/delay@_@astro": "chunks/delay_BwpMe9sD.mjs", "\0virtual:astro:page:node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic@_@js": "chunks/generic_DdU7CG9U.mjs", "\0virtual:astro:page:src/pages/index@_@astro": "chunks/index_DbWUqOgy.mjs", "\0virtual:astro:page:src/pages/locations@_@astro": "chunks/locations_DOUAP4v-.mjs", "\0virtual:astro:page:src/pages/new-test@_@astro": "chunks/new-test_CiQORV8B.mjs", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@7.3.7_jiti@1.21.7_yaml@2.9.0/node_modules/astro/dist/assets/services/noop.js": "chunks/noop_CWC3mE6X.mjs", "\0virtual:astro:page:src/pages/delay/overview@_@astro": "chunks/overview_DSHxjtA8.mjs", "\0virtual:astro:page:src/pages/perf@_@astro": "chunks/perf_BshqW5nh.mjs", "\0virtual:astro:page:src/pages/status@_@astro": "chunks/status_CjnLdbYa.mjs", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts": "_astro/BaseLayout.astro_astro_type_script_index_0_lang.CfZsP9kA.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph.js": "_astro/ErrorGraph.Bt9nhLmw.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts": "_astro/Nav.astro_astro_type_script_index_0_lang.ks407uw-.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js": "_astro/RegionGraphLazy.B5H9OQbu.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js": "_astro/SmartGraph.4MPh28cl.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx": "_astro/Sparkline.CfkFGEnC.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro?astro&type=script&index=0&lang.ts": "_astro/StatusDashboard.astro_astro_type_script_index_0_lang.DntnxiRh.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts": "_astro/ThemeToggle.astro_astro_type_script_index_0_lang.C7v2QkCC.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro?astro&type=script&index=0&lang.ts": "_astro/_...internalJobName_.astro_astro_type_script_index_0_lang.Czb99VLa.js", "@astrojs/preact/client.js": "_astro/client.C2CIDpve.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts": "_astro/delay.astro_astro_type_script_index_0_lang.BpnTapQe.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=1&lang.ts": "_astro/delay.astro_astro_type_script_index_1_lang.BO2P3HWc.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts": "_astro/locations.astro_astro_type_script_index_0_lang.DVDwxraB.js", "astro:scripts/page.js": "_astro/page.Dwipeu-R.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts": "_astro/perf.astro_astro_type_script_index_0_lang.CSpW2sk0.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraph.js": "_astro/RegionGraph.uzADr8Hc.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/@preact+signals@2.11.3_preact@10.29.2/node_modules/@preact/signals/dist/signals.module.js": "_astro/signals.module.amI1WY2E.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts", "addEventListener(`load`,()=>document.documentElement.classList.add(`loaded`));"], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts", "var e=class extends HTMLElement{constructor(){super(),this.appendChild(this.querySelector(`template`).content.cloneNode(!0));let e=this.querySelector(`button`),t=document.getElementById(`menu-content`);t.hidden=!0,t.classList.add(`menu-content`);let n=n=>{e.setAttribute(`aria-expanded`,n?`true`:`false`),t.hidden=!n};e.addEventListener(`click`,()=>n(t.hidden));let r=t=>{n(t.matches),e.hidden=t.matches},i=window.matchMedia(`(min-width: 50em)`);r(i),i.addEventListener(`change`,r)}};customElements.define(`menu-button`,e);"], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts", "var e=class extends HTMLElement{constructor(){super();let e=this.querySelector(`button`),t=t=>{document.documentElement.classList[t?`add`:`remove`](`theme-dark`),document.documentElement.classList[t?`add`:`remove`](`dark`),e.setAttribute(`aria-pressed`,String(t));let n=new CustomEvent(`themeChange`,{detail:{dark:t}});window.dispatchEvent(n),console.log(`dispatched!`)};e.addEventListener(`click`,()=>t(!this.isDark())),t(this.isDark())}isDark(){return document.documentElement.classList.contains(`theme-dark`)}};customElements.define(`theme-toggle`,e);"], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts", '(function(){let e=document.getElementById(`job-filter`);if(!e)return;let t=Array.from(document.querySelectorAll(`[data-category]`)),n=new WeakMap;for(let e of t)n.set(e,e.open);function r(e){let r=(e||``).trim().toLowerCase();for(let e of t){let t=!1;e.querySelectorAll(`[id$="grid"]`).forEach(e=>{let n=e.parentElement,i=e.id.toLowerCase().includes(r);n&&(n.style.display=i?``:`none`),i&&(t=!0)}),e.style.display=t?``:`none`,e.open=r?t:n.get(e)}}e.addEventListener(`input`,e=>r(e.target.value))})();'], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts", 'var e=document.getElementById(`location-filter`);e?.addEventListener(`input`,()=>{let t=e.value.toLowerCase();document.querySelectorAll(`tr[id$="-row"]`).forEach(e=>{e.hidden=!(!t||(e.textContent?.toLowerCase().includes(t)??!0))})});'], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts", '(function(){let e=Array.from(document.querySelectorAll(`[data-category]`)),t=new Set([`now`,`p50`,`p50-30d`]);function n(e){switch(e){case`name`:return`data-name`;case`provider`:return`data-provider`;case`now`:return`data-now`;case`p50`:return`data-p50`;case`p50-30d`:return`data-p50-30d`;default:return`data-name`}}function r(e,t){return Array.from(e.querySelectorAll(`tr.perf-child`)).filter(e=>e.getAttribute(`data-key`)===t)}function i(e,r,i){let a=e.querySelector(`tbody`);if(!a)return;let o=n(r),s=t.has(r),c=[],l=null;for(let e of Array.from(a.children))e.classList.contains(`perf-parent`)?(l={head:e,kids:[]},c.push(l)):e.classList.contains(`perf-child`)?l?l.kids.push(e):c.push({head:e,kids:[]}):(l=null,c.push({head:e,kids:[]}));c.sort((e,t)=>{let n=e.head.getAttribute(`data-expandable`)===`true`?0:1,r=t.head.getAttribute(`data-expandable`)===`true`?0:1;if(n!==r)return n-r;let a=e.head.getAttribute(o)||``,c=t.head.getAttribute(o)||``,l=s?(parseFloat(a)||0)-(parseFloat(c)||0):a.localeCompare(c);return i?l:-l});for(let e of c){a.appendChild(e.head);for(let t of e.kids)a.appendChild(t)}e.querySelectorAll(`th[data-sort] .sort-ind`).forEach(e=>e.textContent=``);let u=e.querySelector(`th[data-sort="${r}"] .sort-ind`);u&&(u.textContent=i?` \u25B2`:` \u25BC`)}for(let e of document.querySelectorAll(`.perf-table`)){let t=e.querySelector(`tbody`),n={key:`p50`,asc:!0};e.querySelectorAll(`th[data-sort]`).forEach(t=>{t.addEventListener(`click`,()=>{let r=t.getAttribute(`data-sort`);n.asc=n.key!==r||!n.asc,n.key=r,i(e,n.key,n.asc)})}),i(e,n.key,n.asc),e.querySelectorAll(`tr.perf-parent[data-expandable="true"]`).forEach(e=>{e.addEventListener(`click`,n=>{if(n.target.closest(`a`))return;let i=e.getAttribute(`data-key`),a=e.getAttribute(`aria-expanded`)===`true`;e.setAttribute(`aria-expanded`,a?`false`:`true`);for(let e of r(t,i))e.hidden=a})})}let a=document.getElementById(`job-filter`);if(!a)return;let o=new WeakMap;for(let t of e)o.set(t,t.open);function s(t){let n=(t||``).trim().toLowerCase();for(let t of e){let e=!1;t.querySelectorAll(`.perf-table tbody`).forEach(t=>{t.querySelectorAll(`tr.perf-parent`).forEach(i=>{let a=i.getAttribute(`data-key`),o=i.getAttribute(`data-expandable`)===`true`,s=r(t,a),c=(i.getAttribute(`data-name`)||``).includes(n),l=!1;for(let e of s){let t=(e.getAttribute(`data-name`)||``).includes(n),r=n?c||t:!1;e.hidden=!r,r&&(l=!0)}let u=!n||c||l;if(i.style.display=u?``:`none`,!u)for(let e of s)e.hidden=!0;o&&i.setAttribute(`aria-expanded`,l?`true`:`false`),u&&(e=!0)})}),t.style.display=e?``:`none`,t.open=n?e:o.get(t)}}a.addEventListener(`input`,e=>s(e.target.value))})();']], "assets": ["/_astro/BaseLayout.D2nCt-Qx.css", "/_astro/ErrorGraph.Bt9nhLmw.js", "/_astro/RegionGraph.uzADr8Hc.js", "/_astro/RegionGraphLazy.B5H9OQbu.js", "/_astro/SmartGraph.4MPh28cl.js", "/_astro/Sparkline.CfkFGEnC.js", "/_astro/StatusDashboard.astro_astro_type_script_index_0_lang.DntnxiRh.js", "/_astro/_...internalJobName_.astro_astro_type_script_index_0_lang.Czb99VLa.js", "/_astro/chartTheme.KQwsNxyN.js", "/_astro/client.C2CIDpve.js", "/_astro/delay.astro_astro_type_script_index_1_lang.BO2P3HWc.js", "/_astro/hooks.module.Cl-DFk05.js", "/_astro/jsxRuntime.module.DR7R8qVS.js", "/_astro/page.Dwipeu-R.js", "/_astro/page.Dwipeu-R.js", "/_astro/preact.module.6GsfWEHp.js", "/_astro/preload-helper.oCYlU9a4.js", "/_astro/signals.module.amI1WY2E.js", "/assets/backgrounds/bg-footer-dark-1440w.jpg", "/assets/backgrounds/bg-footer-dark-800w.jpg", "/assets/backgrounds/bg-footer-light-1440w.jpg", "/assets/backgrounds/bg-footer-light-800w.jpg", "/assets/backgrounds/bg-main-dark-1440w.jpg", "/assets/backgrounds/bg-main-dark-800w.jpg", "/assets/backgrounds/bg-main-dark.svg", "/assets/backgrounds/bg-main-light-1440w.jpg", "/assets/backgrounds/bg-main-light-800w.jpg", "/assets/backgrounds/bg-main-light.svg", "/assets/backgrounds/bg-subtle-1-dark-1440w.jpg", "/assets/backgrounds/bg-subtle-1-dark-800w.jpg", "/assets/backgrounds/bg-subtle-1-light-1440w.jpg", "/assets/backgrounds/bg-subtle-1-light-800w.jpg", "/assets/backgrounds/bg-subtle-2-dark-1440w.jpg", "/assets/backgrounds/bg-subtle-2-dark-800w.jpg", "/assets/backgrounds/bg-subtle-2-light-1440w.jpg", "/assets/backgrounds/bg-subtle-2-light-800w.jpg", "/assets/backgrounds/noise.png", "/assets/js/8.0.7/signalr-protocol-msgpack.min.js", "/assets/js/8.0.7/signalr-protocol-msgpack.min.js.map", "/assets/js/8.0.7/signalr.min.js", "/assets/js/8.0.7/signalr.min.js.map", "/assets/stock-1.jpg", "/assets/stock-2.jpg", "/assets/stock-3.jpg", "/assets/stock-4.jpg", "/expand.svg", "/favicon-animated.svg", "/favicon.svg"], "buildFormat": "directory", "checkOrigin": true, "actionBodySizeLimit": 1048576, "serverIslandBodySizeLimit": 1048576, "allowedDomains": [], "key": "rc+ADMWORCZvq5IpGzaFjcrrOx1F1SX+PDyVpQhFptM=", "image": {}, "devToolbar": { "enabled": false, "debugInfoOutput": "" }, "logLevel": "info", "shouldInjectCspMetaTags": false });
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
  renderers,
  actions: () => Promise.resolve().then(() => (init_noop_entrypoint_Z3zFhrGC(), noop_entrypoint_Z3zFhrGC_exports)),
  middleware: () => Promise.resolve().then(() => (init_virtual_astro_middleware(), virtual_astro_middleware_exports)),
  sessionDriver: () => Promise.resolve().then(() => (init_virtual_astro_session_driver_C_PI1Pas(), virtual_astro_session_driver_C_PI1Pas_exports)),
  serverIslandMappings: () => Promise.resolve().then(() => (init_virtual_astro_server_island_manifest_C1Q2srgE(), virtual_astro_server_island_manifest_C1Q2srgE_exports)),
  routes: manifestRoutes,
  pageMap
});
function getAmbientManifest() {
  const manifest$1 = manifest;
  if (!manifest$1) throw new AstroError(NoManifestAvailable);
  return manifest$1;
}
var renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
  return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
  Reflect.set(request, renderOptionsSymbol, options);
}
function defineMiddleware(fn) {
  return fn;
}
var FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
var SAFE_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS"
];
function isForbiddenCrossOriginRequest(request, url, isPrerendered) {
  if (isPrerendered) return false;
  if (SAFE_METHODS.includes(request.method)) return false;
  const contentType = request.headers.get("content-type");
  if (contentType && !hasFormLikeHeader(contentType)) return false;
  switch (request.headers.get("sec-fetch-site")) {
    case "":
    case null:
      break;
    case "same-origin":
    case "none":
      return false;
    default:
      return true;
  }
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin !== url.origin;
}
function createCrossOriginForbiddenResponse(request) {
  return new Response(`Cross-site ${request.method} form submissions are forbidden`, { status: 403 });
}
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isForbiddenCrossOriginRequest(request, url, isPrerendered)) return createCrossOriginForbiddenResponse(request);
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) return true;
  }
  return false;
}
var FetchFeatures = {
  redirects: 1,
  sessions: 2,
  actions: 4,
  middleware: 8,
  i18n: 16,
  cache: 32
};
var ALL_FETCH_FEATURES = FetchFeatures.redirects | FetchFeatures.sessions | FetchFeatures.actions | FetchFeatures.middleware | FetchFeatures.i18n | FetchFeatures.cache;
var usedFeatures = /* @__PURE__ */ new WeakMap();
function markFeatureUsed(manifest2, feature) {
  const entry = usedFeatures.get(manifest2);
  if (entry) entry.bits |= feature;
  else usedFeatures.set(manifest2, { bits: feature });
}
function getUsedFeatures(manifest2) {
  return usedFeatures.get(manifest2)?.bits ?? 0;
}
function rejectInvalidEncoding(state) {
  if (state.invalidEncoding) return new Response(null, {
    status: 400,
    statusText: "Bad Request"
  });
}
var MAX_ARRAY_LEN = 2 ** 32 - 1;
var MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
var DevalueError = class extends Error {
  /**
  * @param {string} message
  * @param {string[]} keys
  * @param {any} [value] - The value that failed to be serialized
  * @param {any} [root] - The root value being serialized
  */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
};
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function is_buffer(thing) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(thing);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i5 = 0; i5 < len; i5 += 1) {
    const char = str[i5];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i5) + replacement;
      last_pos = i5 + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object2) {
  return Object.getOwnPropertySymbols(object2).filter((symbol) => Object.getOwnPropertyDescriptor(object2, symbol).enumerable);
}
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n3) {
  if (!Number.isInteger(n3)) return false;
  if (n3 < 0) return false;
  if (n3 > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n3) {
  if (!Number.isInteger(n3)) return false;
  if (n3 < 0) return false;
  if (n3 > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s5) {
  if (s5.length === 0) return false;
  if (s5.length > 1 && s5.charCodeAt(0) === 48) return false;
  for (let i5 = 0; i5 < s5.length; i5++) {
    const c4 = s5.charCodeAt(i5);
    if (c4 < 48 || c4 > 57) return false;
  }
  return is_valid_array_index(+s5);
}
function array_index_cut(keys) {
  for (var i5 = keys.length - 1; i5 >= 0; i5--) if (is_valid_array_index_string(keys[i5])) break;
  return i5 + 1;
}
function valid_array_indices(array2) {
  const keys = Object.keys(array2);
  keys.length = array_index_cut(keys);
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base642) {
  return Uint8Array.fromBase64(base642).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base642) {
  return Uint8Array.from(Buffer.from(base642, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array2 = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i5 = 0; i5 < array2.length; i5 += chunk_size) {
    const chunk = array2.subarray(i5, i5 + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base642) {
  const binary_string = atob(base642);
  const len = binary_string.length;
  const array2 = new Uint8Array(len);
  for (let i5 = 0; i5 < len; i5++) array2[i5] = binary_string.charCodeAt(i5);
  return array2.buffer;
}
var native = typeof Uint8Array.fromBase64 === "function";
var buffer = typeof process === "object" && process.versions?.node !== void 0;
var encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
var decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
function merge_operations(defaults, overrides) {
  if (!overrides) return defaults;
  const merged = {};
  for (const key of Object.keys(defaults)) merged[key] = overrides[key] ?? defaults[key];
  return merged;
}
var NOT_PLAIN = /* @__PURE__ */ Object.freeze({ kind: "not-plain" });
var SYMBOL_KEYS = /* @__PURE__ */ Object.freeze({ kind: "symbol-keys" });
var default_stringify_operations = /* @__PURE__ */ Object.freeze({
  identify: (value) => value,
  typeOf: (value) => value === null ? "null" : typeof value,
  toPrimitive: (value) => value,
  tagOf: (value) => get_type(value),
  isThenable: (value) => typeof value.then === "function",
  toPromise: (thenable) => Promise.resolve(thenable),
  unbox: (boxed) => boxed.valueOf(),
  toISOString: (date2) => isNaN(date2.getDate()) ? "" : date2.toISOString(),
  toStringValue: (value) => value.toString(),
  regExpInfo: (regexp) => ({
    source: regexp.source,
    flags: regexp.flags
  }),
  valuesOf: (set) => set,
  entriesOf: (map) => map,
  viewInfo: (view) => {
    if (is_buffer(view)) view = new Uint8Array(view);
    return {
      buffer: view.buffer,
      byteOffset: view.byteOffset,
      byteLength: view.byteLength,
      length: view.length,
      bufferByteLength: view.buffer.byteLength
    };
  },
  toArrayBuffer: (buffer2) => buffer2,
  lengthOf: (array2) => array2.length,
  hasOwn: (value, key) => Object.hasOwn(value, key),
  indicesOf: (array2) => valid_array_indices(array2),
  shapeOf: (value) => {
    if (!is_plain_object(value)) return NOT_PLAIN;
    if (enumerable_symbols(value).length > 0) return SYMBOL_KEYS;
    return {
      kind: Object.getPrototypeOf(value) === null ? "null-proto" : "plain",
      keys: Object.keys(value)
    };
  },
  get: (value, key) => value[key]
});
var array_buffer_byte_length = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
var shared_array_buffer_byte_length = typeof SharedArrayBuffer === "undefined" ? void 0 : Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get;
var default_parse_operations = /* @__PURE__ */ Object.freeze({
  fromPrimitive: (primitive) => primitive,
  fromISOString: (iso) => new Date(iso),
  fromStringValue: (tag, text) => {
    if (tag === "URL") return new URL(text);
    if (tag === "URLSearchParams") return new URLSearchParams(text);
    return Temporal[tag.slice(9)].from(text);
  },
  fromArrayBuffer: (buffer2) => buffer2,
  fromRegExpInfo: (source, flags) => new RegExp(source, flags),
  fromViewInfo: (tag, buffer2, byteOffset, length) => {
    try {
      array_buffer_byte_length.call(buffer2);
    } catch (error3) {
      if (!shared_array_buffer_byte_length) throw error3;
      shared_array_buffer_byte_length.call(buffer2);
    }
    const Constructor = globalThis[tag];
    return byteOffset !== void 0 ? new Constructor(buffer2, byteOffset, length) : new Constructor(buffer2);
  },
  box: (value) => Object(value),
  createArray: (length) => new Array(length),
  createSparseArray: (length) => {
    const array2 = [];
    array2[MAX_ARRAY_INDEX] = void 0;
    delete array2[MAX_ARRAY_INDEX];
    array2.length = length;
    return array2;
  },
  createObject: () => ({}),
  createNullPrototypeObject: () => /* @__PURE__ */ Object.create(null),
  createSet: () => /* @__PURE__ */ new Set(),
  createMap: () => /* @__PURE__ */ new Map(),
  set: (target, key, value) => {
    target[key] = value;
  },
  addValue: (set, value) => {
    set.add(value);
  },
  addEntry: (map, key, value) => {
    map.set(key, value);
  }
});
function parse2(serialized, revivers, options) {
  return unflatten(JSON.parse(serialized), revivers, options);
}
function unflatten(parsed, revivers, options) {
  const ops = merge_operations(default_parse_operations, options?.operations);
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid input");
  const values = parsed;
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === -1) return ops.fromPrimitive(void 0);
    if (index === -3) return ops.fromPrimitive(NaN);
    if (index === -4) return ops.fromPrimitive(Infinity);
    if (index === -5) return ops.fromPrimitive(-Infinity);
    if (index === -6) return ops.fromPrimitive(-0);
    if (standalone || typeof index !== "number") throw new Error(`Invalid input`);
    if (index in hydrated) return hydrated[index];
    if (index >= values.length) throw new Error(`Invalid input`);
    const value = values[index];
    if (!value || typeof value !== "object") hydrated[index] = ops.fromPrimitive(value);
    else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i5 = value[1];
          if (typeof i5 !== "number") i5 = values.push(value[1]) - 1;
          if (Object.hasOwn(hydrated, i5)) return hydrated[index] = reviver(hydrated[i5]);
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i5)) throw new Error("Invalid circular reference");
          hydrating.add(i5);
          hydrated[index] = reviver(hydrate(i5));
          hydrating.delete(i5);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = ops.fromISOString(value[1]);
            break;
          case "Set":
            const set = ops.createSet();
            hydrated[index] = set;
            for (let i5 = 1; i5 < value.length; i5 += 1) ops.addValue(set, hydrate(value[i5]));
            break;
          case "Map":
            const map = ops.createMap();
            hydrated[index] = map;
            for (let i5 = 1; i5 < value.length; i5 += 2) ops.addEntry(map, hydrate(value[i5]), hydrate(value[i5 + 1]));
            break;
          case "RegExp":
            hydrated[index] = ops.fromRegExpInfo(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") throw new Error("Invalid input");
            hydrated[index] = ops.box(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = ops.fromPrimitive(BigInt(value[1]));
            break;
          case "null":
            const obj = ops.createNullPrototypeObject();
            hydrated[index] = obj;
            for (let i5 = 1; i5 < value.length; i5 += 2) {
              const key = value[i5];
              if (typeof key !== "string") throw new Error("Cannot parse an object with a non-string key");
              if (key === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
              ops.set(obj, key, hydrate(value[i5 + 1]));
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") throw new Error("Invalid data");
            const buffer2 = hydrate(value[1]);
            hydrated[index] = ops.fromViewInfo(type, buffer2, value[2], value[3]);
            break;
          }
          case "ArrayBuffer": {
            const base642 = value[1];
            if (typeof base642 !== "string") throw new Error("Invalid ArrayBuffer encoding");
            hydrated[index] = ops.fromArrayBuffer(decode64(base642));
            break;
          }
          case "URL":
          case "URLSearchParams":
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime":
            hydrated[index] = ops.fromStringValue(type, value[1]);
            break;
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === -7) {
        const len = value[1];
        if (!is_valid_array_len(len)) throw new Error("Invalid input");
        const array2 = ops.createSparseArray(len);
        hydrated[index] = array2;
        for (let i5 = 2; i5 < value.length; i5 += 2) {
          const idx = value[i5];
          if (!is_valid_array_index(idx) || idx >= len) throw new Error("Invalid input");
          ops.set(array2, idx, hydrate(value[i5 + 1]));
        }
      } else {
        const array2 = ops.createArray(value.length);
        hydrated[index] = array2;
        for (let i5 = 0; i5 < value.length; i5 += 1) {
          const n3 = value[i5];
          if (n3 === -2) continue;
          ops.set(array2, i5, hydrate(n3));
        }
      }
    } else {
      const object2 = ops.createObject();
      hydrated[index] = object2;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
        ops.set(object2, key, hydrate(value[key]));
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify(value, reducers, options) {
  const stringified = run(false, value, reducers, options);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers, options) {
  const ops = merge_operations(default_stringify_operations, options?.operations);
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom2 = [];
  if (reducers) for (const key of Object.getOwnPropertyNames(reducers)) custom2.push({
    key,
    fn: reducers[key]
  });
  const keys = [];
  let p4 = 0;
  function flatten(thing, index2) {
    const type = ops.typeOf(thing);
    if (type === "undefined") return -1;
    let number;
    if (type === "number") {
      number = ops.toPrimitive(thing);
      if (Number.isNaN(number)) return -3;
      if (number === Infinity) return -4;
      if (number === -Infinity) return -5;
      if (number === 0 && 1 / number < 0) return -6;
    }
    const id = ops.identify(thing);
    if (indexes.has(id)) return indexes.get(id);
    index2 ??= p4++;
    indexes.set(id, index2);
    for (const { key, fn } of custom2) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (type === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    else if (type === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    let str = "";
    if (type !== "object") str = stringify_primitive(type === "number" ? number : ops.toPrimitive(thing));
    else if (ops.isThenable(thing)) {
      if (!async) throw new DevalueError(`Cannot stringify a Promise or thenable \u2014 use stringifyAsync instead`, keys, thing, value);
      str = ops.toPromise(thing).then((value2) => {
        const i5 = flatten(value2, index2);
        if (i5 < 0) stringified[index2] = i5;
      });
      str.catch(() => {
      });
    } else {
      const tag = ops.tagOf(thing);
      switch (tag) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(ops.unbox(thing))}]`;
          break;
        case "Date":
          str = `["Date","${ops.toISOString(thing)}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        case "RegExp":
          const { source, flags } = ops.regExpInfo(thing);
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          const length = ops.lengthOf(thing);
          str = "[";
          for (let i5 = 0; i5 < length; i5 += 1) {
            if (i5 > 0) str += ",";
            if (ops.hasOwn(thing, i5)) {
              keys.push(`[${i5}]`);
              str += flatten(ops.get(thing, i5));
              keys.pop();
            } else if (mostly_dense) str += -2;
            else {
              const populated_keys = ops.indicesOf(thing);
              const population = populated_keys.length;
              const d4 = String(length).length;
              if ((length - population) * 3 > 4 + d4 + population * (d4 + 1)) {
                str = "[-7," + length;
                for (let j5 = 0; j5 < populated_keys.length; j5++) {
                  const key = populated_keys[j5];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(ops.get(thing, key));
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += -2;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of ops.valuesOf(thing)) str += `,${flatten(value2)}`;
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of ops.entriesOf(thing)) {
            const key_type = ops.typeOf(key);
            const key_is_primitive = key_type !== "object" && key_type !== "function" && key_type !== "symbol";
            keys.push(`.get(${key_is_primitive ? stringify_primitive(ops.toPrimitive(key)) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const info2 = ops.viewInfo(thing);
          str = '["' + tag + '",' + flatten(info2.buffer);
          if (info2.byteLength !== info2.bufferByteLength) str += `,${info2.byteOffset},${info2.length}`;
          str += "]";
          break;
        }
        case "DataView": {
          const info2 = ops.viewInfo(thing);
          str = '["' + tag + '",' + flatten(info2.buffer);
          if (info2.byteLength !== info2.bufferByteLength) str += `,${info2.byteOffset},${info2.byteLength}`;
          str += "]";
          break;
        }
        case "ArrayBuffer":
          str = `["ArrayBuffer","${encode64(ops.toArrayBuffer(thing))}"]`;
          break;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${tag}",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        default: {
          const shape = ops.shapeOf(thing);
          if (shape.kind === "not-plain") throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          if (shape.kind === "symbol-keys") throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          if (shape.kind === "null-proto") {
            str = '["null"';
            for (const key of shape.keys) {
              if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(ops.get(thing, key))}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of shape.keys) {
              if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(ops.get(thing, key))}`;
              keys.pop();
            }
            str += "}";
          }
        }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return (-1).toString();
  if (thing === 0 && 1 / thing < 0) return (-6).toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore":
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
  }
}
var ACTION_QUERY_PARAMS = {
  actionName: "_action",
  actionPayload: "_astroActionPayload"
};
var codeToStatusMap = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError2 extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError2.codeToStatus(params.code);
    if (params.stack) this.stack = params.stack;
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) return new ActionInputError(body.issues);
    if (isActionError(body)) return new ActionError2(body);
    return new ActionError2({ code: "INTERNAL_SERVER_ERROR" });
  }
};
function isActionError(error3) {
  return typeof error3 === "object" && error3 != null && "type" in error3 && error3.type === "AstroActionError";
}
function isInputError(error3) {
  return typeof error3 === "object" && error3 != null && "type" in error3 && error3.type === "AstroActionInputError" && "issues" in error3 && Array.isArray(error3.issues);
}
var ActionInputError = class extends ActionError {
  type = "AstroActionInputError";
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue2 of issues) if (issue2.path.length > 0) {
      const key = issue2.path[0].toString();
      this.fields[key] ??= [];
      this.fields[key]?.push(issue2.message);
    }
  }
};
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign({
      "ASSETS_PREFIX": void 0,
      "BASE_URL": "/",
      "DEV": false,
      "MODE": "production",
      "PROD": true,
      "SITE": void 0,
      "SSR": true
    }, {})?.PROD) return {
      error: ActionError.fromJson(json),
      data: void 0
    };
    else {
      const error3 = ActionError.fromJson(json);
      error3.stack = actionResultErrorStack.get();
      return {
        error: error3,
        data: void 0
      };
    }
  }
  if (res.type === "empty") return {
    data: void 0,
    error: void 0
  };
  return {
    data: parse2(res.body, { URL: (href) => new URL(href) }),
    error: void 0
  };
}
var actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    return baseAction.bind(context)(input);
  };
}
var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
var cookieOctetRegExp = /^[!#$&'()*+\-.\/0-9:<=>?@A-Z[\]\^_`a-z{|}~]*$/;
var NullObject = /* @__PURE__ */ (() => {
  const C4 = function() {
  };
  C4.prototype = /* @__PURE__ */ Object.create(null);
  return C4;
})();
function parseCookie(str, options) {
  const obj = new NullObject();
  const len = str.length;
  if (len < 2) return obj;
  const dec = options?.decode || decode2;
  let index = 0;
  do {
    const eqIdx = eqIndex(str, index, len);
    if (eqIdx === len) break;
    const endIdx = endIndex(str, index, len);
    if (eqIdx > endIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = valueSlice(str, index, eqIdx);
    if (obj[key] === void 0) obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
    index = endIdx + 1;
  } while (index < len);
  return obj;
}
function stringifySetCookie(cookie, options) {
  const enc = options?.encode || defaultEncode;
  if (!cookieNameRegExp.test(cookie.name)) throw new TypeError(`argument name is invalid: ${cookie.name}`);
  const value = cookie.value == null ? "" : enc(cookie.value);
  if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${cookie.value}`);
  let str = cookie.name + "=" + value;
  if (cookie.maxAge !== void 0) {
    if (!Number.isInteger(cookie.maxAge)) throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
    str += "; Max-Age=" + cookie.maxAge;
  }
  if (cookie.domain) {
    if (!domainValueRegExp.test(cookie.domain)) throw new TypeError(`option domain is invalid: ${cookie.domain}`);
    str += "; Domain=" + cookie.domain;
  }
  if (cookie.path) {
    if (!pathValueRegExp.test(cookie.path)) throw new TypeError(`option path is invalid: ${cookie.path}`);
    str += "; Path=" + cookie.path;
  }
  if (cookie.expires) {
    if (!Number.isFinite(cookie.expires.valueOf())) throw new TypeError(`option expires is invalid: ${cookie.expires}`);
    str += "; Expires=" + cookie.expires.toUTCString();
  }
  if (cookie.httpOnly) str += "; HttpOnly";
  if (cookie.secure) str += "; Secure";
  if (cookie.partitioned) str += "; Partitioned";
  if (cookie.priority) switch (typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0) {
    case "low":
      str += "; Priority=Low";
      break;
    case "medium":
      str += "; Priority=Medium";
      break;
    case "high":
      str += "; Priority=High";
      break;
    default:
      throw new TypeError(`option priority is invalid: ${cookie.priority}`);
  }
  if (cookie.sameSite) switch (typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite) {
    case true:
    case "strict":
      str += "; SameSite=Strict";
      break;
    case "lax":
      str += "; SameSite=Lax";
      break;
    case "none":
      str += "; SameSite=None";
      break;
    default:
      throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
  }
  return str;
}
function endIndex(str, min, len) {
  const index = str.indexOf(";", min);
  return index === -1 ? len : index;
}
function eqIndex(str, min, len) {
  const index = str.indexOf("=", min);
  return index === -1 ? len : index;
}
function valueSlice(str, min, max) {
  if (min === max) return "";
  let start2 = min;
  let end = max;
  do {
    const code = str.charCodeAt(start2);
    if (code !== 32 && code !== 9) break;
  } while (++start2 < end);
  while (end > start2) {
    const code = str.charCodeAt(end - 1);
    if (code !== 32 && code !== 9) break;
    end--;
  }
  return str.slice(start2, end);
}
function decode2(str) {
  if (str.indexOf("%") === -1) return str;
  try {
    return decodeURIComponent(str);
  } catch (e4) {
    return str;
  }
}
function defaultEncode(str) {
  return cookieOctetRegExp.test(str) ? str : encodeURIComponent(str);
}
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol2 = /* @__PURE__ */ Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
};
var AstroCookies = class {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  #logger;
  constructor(request, logger) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
    this.#logger = logger;
  }
  /**
  * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
  * in a Set-Cookie header added to the response.
  * @param key The cookie to delete
  * @param options Options related to this deletion, such as the path of the cookie.
  */
  delete(key, options) {
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      stringifySetCookie({
        ...options,
        name: key,
        value: DELETED_VALUE,
        expires: DELETED_EXPIRATION,
        maxAge: void 0
      }),
      false
    ]);
  }
  /**
  * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
  * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
  * from that set call, overriding any values already part of the request.
  * @param key The cookie to get.
  * @returns An object containing the cookie value as well as convenience methods for converting its value.
  */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) return new AstroCookie(serializedValue);
      else return;
    }
    const decode3 = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value !== void 0) {
        let decodedValue;
        try {
          decodedValue = decode3(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
  * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
  * part of the initial request or set via Astro.cookies.set(key)
  * @param key The cookie to check for.
  * @param _options This parameter is no longer used.
  * @returns
  */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    return this.#ensureParsed()[key] !== void 0;
  }
  /**
  * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
  * an object it will be stringified via JSON.stringify(value). Additionally you
  * can provide options customizing how this cookie will be set, such as setting httpOnly
  * in order to prevent the cookie from being read in client-side JavaScript.
  * @param key The name of the cookie to set.
  * @param value A value, either a string or other primitive or an object.
  * @param options Options for the cookie, such as the path and security settings.
  */
  set(key, value, options) {
    if (this.#consumed) this.#logger.warn("SKIP_FORMAT", "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
    let serializedValue;
    if (typeof value === "string") serializedValue = value;
    else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
      else serializedValue = toStringValue;
    }
    const { encode: encode2, ...attributes } = options ?? {};
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      stringifySetCookie({
        ...attributes,
        name: key,
        value: serializedValue
      }, { encode: encode2 }),
      true
    ]);
    if (this.#request[responseSentSymbol2]) throw new AstroError({ ...ResponseSentError });
  }
  /**
  * Merges a new AstroCookies instance into the current instance. Any new cookies
  * will be added to the current instance, overwriting any existing cookies with the same name.
  */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
  }
  /**
  * Astro.cookies.header() returns an iterator for the cookies that have previously
  * been set by either Astro.cookies.set() or Astro.cookies.delete().
  * This method is primarily used by adapters to set the header on outgoing responses.
  * @returns
  */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) yield value[1];
  }
  /**
  * Marks the cookies as consumed and returns the header values.
  * After consumption, any subsequent `set()` calls will warn.
  */
  consume() {
    this.#consumed = true;
    return this.headers();
  }
  /**
  * @deprecated Use the instance method `cookies.consume()` instead.
  * Kept for backward compatibility with adapters.
  */
  static consume(cookies) {
    return cookies.consume();
  }
  #ensureParsed() {
    if (!this.#requestValues) this.#parse();
    if (!this.#requestValues) this.#requestValues = /* @__PURE__ */ Object.create(null);
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) return;
    this.#requestValues = parseCookie(raw, { decode: identity });
  }
};
var astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) return cookies;
  else return;
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) return [];
  for (const headerValue of cookies.consume()) yield headerValue;
  return [];
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) for (const locale of locales) if (typeof locale === "string") {
    if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) return true;
  } else if (segment === locale.path) return true;
  return false;
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function isLocalizedErrorRoute(route, status, locales) {
  if (!locales) return false;
  const suffix = `/${status}`;
  if (!route.endsWith(suffix)) return false;
  const localeSegment = route.slice(0, -suffix.length);
  if (!localeSegment || localeSegment.includes("/", 1)) return false;
  return pathHasLocale(localeSegment, locales);
}
function getErrorRoutePath(pathname, status, routes, locales, appendTrailingSlash = false) {
  const suffix = appendTrailingSlash ? "/" : "";
  if (locales) {
    const firstSegment = pathname.split("/").find(Boolean);
    if (firstSegment && pathHasLocale(`/${firstSegment}`, locales)) {
      const localized = `/${firstSegment}/${status}`;
      if (routes.some((route) => route.route === localized)) return `${localized}${suffix}`;
    }
  }
  return `/${status}${suffix}`;
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
function getFallbackRoute(route, routeList) {
  const fallbackRoute = routeList.find((r5) => {
    if (route.route === "/" && r5.routeData.route === "/") return true;
    return r5.routeData.fallbackRoutes.find((f5) => {
      return f5.route === route.route;
    });
  });
  if (!fallbackRoute) throw new Error(`No fallback route found for route ${route.route}`);
  return fallbackRoute.routeData;
}
function getCustom404Route(manifestData) {
  return manifestData.routes.find((r5) => isRoute404(r5.route));
}
function getCustom500Route(manifestData) {
  return manifestData.routes.find((r5) => isRoute500(r5.route));
}
function getDefaultStatusCode(manifest2, routeData, pathname) {
  if (!routeData.pattern.test(pathname)) {
    for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(pathname)) return 302;
  }
  const route = removeTrailingForwardSlash(routeData.route);
  const locales = manifest2.i18n?.locales;
  if (isRoute404(route) || isLocalizedErrorRoute(route, 404, locales)) return 404;
  if (isRoute500(route) || isLocalizedErrorRoute(route, 500, locales)) return 500;
  return 200;
}
function routeHasHtmlExtension(route) {
  return route.segments.some((segment) => segment.some((part) => !part.dynamic && part.content.includes(".html")));
}
var RedirectComponentInstance = { default() {
  return new Response(null, { status: 301 });
} };
var RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_4, next) => next()
};
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) prefix = "";
  else if (typeof assetsPrefix === "string") prefix = assetsPrefix;
  else prefix = assetsPrefix[fileExtension2.slice(1)] || assetsPrefix.fallback;
  return prefix;
}
var URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  return {
    pathname: !URL.canParse(path) && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function appendQueryParams(path, queryParams) {
  const queryString = queryParams.toString();
  if (!queryString) return path;
  const hashIndex = path.indexOf("#");
  const basePath = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
  return `${basePath}${basePath.includes("?") ? "&" : "?"}${queryString}${hash}`;
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  else url = href;
  if (queryParams) url = appendQueryParams(url, queryParams);
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") return {
    props: {},
    children: stylesheet.content
  };
  else return {
    props: {
      rel: "stylesheet",
      href: createAssetLink(stylesheet.src, base, assetsPrefix, queryParams)
    },
    children: ""
  };
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(stylesheets.map((s5) => createStylesheetElement(s5, base, assetsPrefix, queryParams)));
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") return createModuleScriptElementWithSrc(script.value, base, assetsPrefix, queryParams);
  else return {
    props: { type: "module" },
    children: script.value
  };
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix, queryParams)
    },
    children: ""
  };
}
function createManifestMemo(derive) {
  const cache = /* @__PURE__ */ new WeakMap();
  return {
    get(manifest2) {
      if (cache.has(manifest2)) return cache.get(manifest2);
      const value = derive(manifest2);
      cache.set(manifest2, value);
      return value;
    },
    has(manifest2) {
      return cache.has(manifest2);
    },
    set(manifest2, value) {
      cache.set(manifest2, value);
    },
    invalidate(manifest2) {
      cache.delete(manifest2);
    }
  };
}
function createAsyncManifestMemo(derive) {
  const cache = /* @__PURE__ */ new WeakMap();
  return {
    get(manifest2) {
      let promise = cache.get(manifest2);
      if (!promise) {
        promise = derive(manifest2);
        cache.set(manifest2, promise);
        promise.catch(() => {
          if (cache.get(manifest2) === promise) cache.delete(manifest2);
        });
      }
      return promise;
    },
    invalidate(manifest2) {
      cache.delete(manifest2);
    }
  };
}
async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) throw new BodySizeLimitError(limit);
  }
  if (!request.body) return /* @__PURE__ */ new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) throw new BodySizeLimitError(limit);
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
var BodySizeLimitError = class extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
};
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
    else return "\\/" + segment.map((part) => {
      if (part.spread) return "(.*?)";
      else if (part.dynamic) return "([^/]+?)";
      else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") return "\\/$";
  if (addTrailingSlash === "never") return "$";
  return "\\/?$";
}
var SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
var SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
var DEFAULT_BODY_SIZE_LIMIT = 1048576;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const params = new URL(request.url).searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) return badRequest("Missing required query parameters.");
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST":
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") return badRequest("Plaintext componentExport is not allowed. componentExport must be encrypted.");
        return data;
      } catch (e4) {
        if (e4 instanceof BodySizeLimitError) return new Response(null, {
          status: 413,
          statusText: e4.message
        });
        if (e4 instanceof SyntaxError) return badRequest("Request format is invalid.");
        throw e4;
      }
    default:
      return new Response(null, { status: 405 });
  }
}
function createEndpoint(manifest2) {
  const page14 = async (result) => {
    const params = result.params;
    if (!params.name) return new Response(null, {
      status: 400,
      statusText: "Bad request"
    });
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest2.serverIslandBodySizeLimit);
    if (data instanceof Response) return data;
    let imp = (await (await manifest2.serverIslandMappings?.())?.serverIslandMap)?.get(componentId);
    if (!imp) return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(key, data.encryptedComponentExport, `export:${componentId}`);
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") try {
      const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
      props = JSON.parse(propString);
    } catch (_e) {
      return badRequest("Encrypted props value is invalid.");
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") try {
      const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
      decryptedSlots = JSON.parse(slotsString);
    } catch (_e) {
      return badRequest("Encrypted slots value is invalid.");
    }
    let Component = (await imp())[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    result._metadata.routeHasPropagation = true;
    const renderPropagatedHead = () => markHTMLString(result._metadata.extraHead.join(""));
    return renderTemplate`${renderPropagatedHead}${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page14.isAstroComponentFactory = true;
  return {
    default: page14,
    partial: true
  };
}
var { replace } = "";
var ca = /[&<>'"]/g;
var esca = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
};
var pe = (m4) => esca[m4];
var escape = (es) => replace.call(es, ca, pe);
function template({ title, pathname, statusCode = 404, tabTitle, body }) {
  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
var DEFAULT_404_ROUTE = {
  component: DEFAULT_404_COMPONENT,
  params: [],
  pattern: /^\/404\/?$/,
  prerender: false,
  pathname: "/404",
  segments: [[{
    content: "404",
    dynamic: false,
    spread: false
  }]],
  type: "page",
  route: "/404",
  fallbackRoutes: [],
  isIndex: false,
  origin: "internal",
  distURL: []
};
async function default404Page({ pathname }) {
  return new Response(template({
    statusCode: 404,
    title: "Not found",
    tabTitle: "404: Not Found",
    pathname
  }), {
    status: 404,
    headers: { "Content-Type": "text/html" }
  });
}
default404Page.isAstroComponentFactory = true;
var default404Instance = { default: default404Page };
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.rootDir);
  return [{
    instance: default404Instance,
    matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
    route: DEFAULT_404_ROUTE.route,
    component: DEFAULT_404_COMPONENT
  }, {
    instance: createEndpoint(manifest2),
    matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
    route: SERVER_ISLAND_ROUTE,
    component: SERVER_ISLAND_COMPONENT
  }];
}
var defaultRoutesMemo = createManifestMemo(createDefaultRoutes);
function getDefaultRoutes(manifest2) {
  return defaultRoutesMemo.get(manifest2);
}
var loggers = /* @__PURE__ */ new WeakMap();
function getLogger(manifest2) {
  let logger = loggers.get(manifest2);
  if (!logger) {
    logger = createConsoleLogger({ level: manifest2.logLevel });
    loggers.set(manifest2, logger);
  }
  return logger;
}
var resolvedLogger = createAsyncManifestMemo(async (manifest2) => {
  const logger = getLogger(manifest2);
  try {
    const destination = (await manifest2.logger?.())?.default;
    if (destination) logger.setDestination(destination);
  } catch (error3) {
    logger.error("config", "Failed to load the configured logger destination; continuing with the console logger.\n" + (error3 instanceof Error ? error3.stack ?? error3.message : String(error3)));
  }
  return logger;
});
function getResolvedLogger(manifest2) {
  return resolvedLogger.get(manifest2);
}
function createRewriteRouteValidator(manifest2, getComponentByRoute2) {
  return async (route, pathname) => {
    try {
      await getProps({
        mod: await getComponentByRoute2(manifest2, route),
        routeData: route,
        routeCache: getRouteCache(manifest2),
        pathname,
        logger: getLogger(manifest2),
        serverLike: manifest2.serverLike,
        base: manifest2.base,
        trailingSlash: manifest2.trailingSlash
      });
      return true;
    } catch (e4) {
      if (isAstroError(e4) && e4.title === NoMatchingStaticPathFound.title) return false;
      throw e4;
    }
  };
}
function createRequest({ url, headers, method = "GET", body = void 0, logger, isPrerendered = false, routePattern, init }) {
  const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(Object.entries(headers).filter(([name]) => !name.startsWith(":")));
  if (typeof url === "string") url = new URL(url);
  if (isPrerendered) url.search = "";
  const request = new Request(url, {
    method,
    headers: headersObj,
    body: isPrerendered ? null : body,
    ...init
  });
  if (isPrerendered) {
    let _headers = request.headers;
    const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
    Object.defineProperty(request, "headers", {
      ...headersDesc,
      get() {
        logger.warn(null, `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`);
        return _headers;
      },
      set(newHeaders) {
        _headers = newHeaders;
      }
    });
  }
  return request;
}
var MultiLevelEncodingError = class extends Error {
  constructor() {
    super("URL encoding depth exceeded the maximum number of decode iterations");
    this.name = "MultiLevelEncodingError";
  }
};
var MAX_DECODE_ITERATIONS = 10;
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  let iterations = 0;
  while (decoded !== pathname) {
    if (iterations >= MAX_DECODE_ITERATIONS) throw new MultiLevelEncodingError();
    pathname = decoded;
    try {
      decoded = decodeURI(pathname);
    } catch {
      break;
    }
    iterations++;
  }
  return decoded;
}
async function findRouteToRewrite({ payload, routes, request, trailingSlash, buildFormat, base, outDir, validate: validate2 }) {
  let newUrl = void 0;
  if (payload instanceof URL) newUrl = payload;
  else if (payload instanceof Request) newUrl = new URL(payload.url);
  else newUrl = new URL(collapseDuplicateSlashes(payload), new URL(request.url).origin);
  const { pathname, resolvedUrlPathname } = normalizeRewritePathname(newUrl.pathname, base, trailingSlash, buildFormat);
  newUrl.pathname = resolvedUrlPathname;
  const decodedPathname = validateAndDecodePathname(pathname);
  if (isRoute404(decodedPathname)) {
    const errorRoute = routes.find((route) => route.route === "/404");
    if (errorRoute) return {
      routeData: errorRoute,
      newUrl,
      pathname: decodedPathname
    };
  }
  if (isRoute500(decodedPathname)) {
    const errorRoute = routes.find((route) => route.route === "/500");
    if (errorRoute) return {
      routeData: errorRoute,
      newUrl,
      pathname: decodedPathname
    };
  }
  let foundRoute;
  let firstValidationError = null;
  for (const route of routes) if (route.pattern.test(decodedPathname)) {
    if (route.params && route.params.length !== 0) {
      if (route.distURL && route.distURL.length !== 0) {
        if (!route.distURL.find((url) => url.href.replace(outDir.toString(), "").replace(/(?:\/index\.html|\.html)$/, "") === trimSlashes(pathname))) continue;
      } else {
        let ownsPathname;
        try {
          ownsPathname = await validate2(route, decodedPathname);
        } catch (error3) {
          firstValidationError ??= error3;
          continue;
        }
        if (!ownsPathname) continue;
      }
    }
    foundRoute = route;
    break;
  }
  if (foundRoute) return {
    routeData: foundRoute,
    newUrl,
    pathname: decodedPathname
  };
  else if (firstValidationError) throw firstValidationError;
  else {
    const custom404 = routes.find((route) => route.route === "/404");
    if (custom404) return {
      routeData: custom404,
      newUrl,
      pathname
    };
    else return {
      routeData: DEFAULT_404_ROUTE,
      newUrl,
      pathname
    };
  }
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
  const canHaveBody = oldRequest.method !== "GET" && oldRequest.method !== "HEAD";
  if (canHaveBody && oldRequest.bodyUsed) throw new AstroError(RewriteWithBodyUsed);
  return createRequest({
    url: newUrl,
    method: oldRequest.method,
    body: canHaveBody ? oldRequest.body : void 0,
    isPrerendered,
    logger,
    headers: isPrerendered ? {} : oldRequest.headers,
    routePattern,
    init: {
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      duplex: "half"
    }
  });
}
function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) pathname = "/";
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") finalPathname = "/";
  else if (shouldAppendSlash) finalPathname = appendForwardSlash(pathname);
  else finalPathname = removeTrailingForwardSlash(pathname);
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}
function getOriginPathname(request) {
  const origin = Reflect.get(request, originPathnameSymbol);
  if (origin) return decodeURIComponent(origin);
  return new URL(request.url).pathname;
}
function normalizeRewritePathname(urlPathname, base, trailingSlash, buildFormat) {
  let pathname = collapseDuplicateSlashes(urlPathname);
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  if (base !== "/") {
    if (urlPathname === base || urlPathname === removeTrailingForwardSlash(base)) pathname = "/";
    else if (urlPathname.startsWith(base)) {
      pathname = shouldAppendSlash ? appendForwardSlash(urlPathname) : removeTrailingForwardSlash(urlPathname);
      pathname = pathname.slice(base.length);
    }
  }
  if (!pathname.startsWith("/") && shouldAppendSlash && urlPathname.endsWith("/")) pathname = prependForwardSlash(pathname);
  if (buildFormat === "file") pathname = pathname.replace(/\.html$/, "");
  let resolvedUrlPathname;
  if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) resolvedUrlPathname = removeTrailingForwardSlash(base);
  else resolvedUrlPathname = joinPaths(...[base, pathname].filter(Boolean));
  return {
    pathname,
    resolvedUrlPathname
  };
}
async function getModuleForRoute(manifest2, route) {
  for (const defaultRoute of getDefaultRoutes(manifest2)) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
  let routeToProcess = route;
  if (routeIsRedirect(route)) {
    if (route.redirectRoute) routeToProcess = route.redirectRoute;
    else return RedirectSinglePageBuiltModule;
  } else if (routeIsFallback(route)) routeToProcess = getFallbackRoute(route, manifest2.routes);
  if (manifest2.pageMap) {
    const importComponentInstance = manifest2.pageMap.get(routeToProcess.component);
    if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
    return await importComponentInstance();
  } else if (manifest2.pageModule) return manifest2.pageModule;
  throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
}
async function getComponentByRoute(manifest2, routeData) {
  return (await getModuleForRoute(manifest2, routeData)).page();
}
var productionEnvironment = {
  name: "production",
  runtimeMode: "production",
  defaultStreaming: () => true,
  async resolve(manifest2, specifier) {
    if (!(specifier in manifest2.entryModules)) throw new Error(`Unable to resolve [${specifier}]`);
    const bundlePath = manifest2.entryModules[specifier];
    if (bundlePath.startsWith("data:") || bundlePath.length === 0) return bundlePath;
    else return createAssetLink(bundlePath, manifest2.base, manifest2.assetsPrefix);
  },
  async headElements(manifest2, routeData) {
    const { assetsPrefix, base } = manifest2;
    const routeInfo = manifest2.routes.find((route) => route.routeData.route === routeData.route);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) if ("stage" in script) {
      if (script.stage === "head-inline") scripts.add({
        props: {},
        children: script.children
      });
    } else scripts.add(createModuleScriptElement(script, base, assetsPrefix));
    return {
      links,
      styles,
      scripts
    };
  },
  componentMetadata() {
  },
  getComponentByRoute,
  getModuleForRoute,
  async tryRewrite(manifest2, payload, request) {
    const { newUrl, pathname, routeData } = await findRouteToRewrite({
      payload,
      request,
      routes: manifest2.routes.map((r5) => r5.routeData),
      trailingSlash: manifest2.trailingSlash,
      buildFormat: manifest2.buildFormat,
      base: manifest2.base,
      outDir: manifest2.serverLike ? manifest2.buildClientDir : manifest2.outDir,
      validate: createRewriteRouteValidator(manifest2, getComponentByRoute)
    });
    return {
      newUrl,
      pathname,
      componentInstance: await getComponentByRoute(manifest2, routeData),
      routeData
    };
  },
  getRenderers(manifest2) {
    return manifest2.renderers;
  },
  errorStrategy: "default",
  injectCspMetaTagsOnErrorPages: false,
  logRequest() {
  }
};
var environments = /* @__PURE__ */ new WeakMap();
function getEnvironment(manifest2) {
  return environments.get(manifest2) ?? productionEnvironment;
}
function sanitizeParams(params) {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => {
    if (typeof value === "string") return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
    return [key, value];
  }));
}
function getParameter(part, params) {
  if (part.spread) return params[part.content.slice(3)] ?? "";
  if (part.dynamic) {
    if (params[part.content] === void 0) throw new TypeError(`Missing parameter: ${part.content}`);
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? collapseDuplicateLeadingSlashes("/" + segmentPath) : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) trailing = "/";
    return segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing || "/";
  };
}
var VALID_PARAM_TYPES = ["string", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) throw new AstroError({
    ...GetStaticPathsInvalidRouteParam,
    message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
    location: { file: route }
  });
}
function stringifyParams(params, route, trailingSlash) {
  if (route.type === "endpoint" && hasFileExtension(route.route)) trailingSlash = "never";
  const validatedParams = {};
  for (const [key, value] of Object.entries(params)) {
    validateGetStaticPathsParameter([key, value], route.component);
    if (value !== void 0) validatedParams[key] = trimSlashes(value);
  }
  return getRouteGenerator(route.segments, trailingSlash)(validatedParams);
}
function validateDynamicRouteModule(mod, { ssr, route }) {
  if ((!ssr || route.prerender) && route.origin !== "internal" && !mod.getStaticPaths) throw new AstroError({
    ...GetStaticPathsRequired,
    location: { file: route.component }
  });
}
function validateGetStaticPathsResult(result, route) {
  if (!Array.isArray(result)) throw new AstroError({
    ...InvalidGetStaticPathsReturn,
    message: InvalidGetStaticPathsReturn.message(typeof result),
    location: { file: route.component }
  });
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) throw new AstroError({
      ...InvalidGetStaticPathsEntry,
      message: InvalidGetStaticPathsEntry.message(Array.isArray(pathObject) ? "array" : typeof pathObject)
    });
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) throw new AstroError({
      ...GetStaticPathsExpectedParams,
      location: { file: route.component }
    });
  });
}
function generatePaginateFunction(routeMatch, base, trailingSlash) {
  return function paginateUtility(data, args = {}) {
    const generate = getRouteGenerator(routeMatch.segments, trailingSlash);
    let { pageSize: _pageSize, params: _params, props: _props, format: _format } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    const formatUrl = _format || ((url) => url);
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) includesFirstPageNumber = false;
    else if (routeMatch.params.includes(`${paramName}`)) includesFirstPageNumber = true;
    else throw new AstroError({
      ...PageNumberParamNotFound,
      message: PageNumberParamNotFound.message(paramName)
    });
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    return [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start2 = pageSize === Number.POSITIVE_INFINITY ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start2 + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = formatUrl(addRouteBase(generate({ ...params }), base));
      const next = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
        ...params,
        page: String(pageNum + 1)
      }), base));
      const prev = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
        ...params,
        page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
      }), base));
      const first = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
        ...params,
        page: includesFirstPageNumber ? "1" : void 0
      }), base));
      const last = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
        ...params,
        page: String(lastPage)
      }), base));
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start2, end),
            start: start2,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: {
              current,
              next,
              prev,
              first,
              last
            }
          }
        }
      };
    });
  };
}
function addRouteBase(route, base) {
  let routeWithBase = joinPaths(base, route);
  if (routeWithBase === "") routeWithBase = "/";
  return routeWithBase;
}
async function callGetStaticPaths({ mod, route, routeCache, ssr, base, trailingSlash }) {
  const cached2 = routeCache.get(route);
  if (!mod) throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  if (cached2?.staticPaths && cached2.mod === mod) return cached2.staticPaths;
  validateDynamicRouteModule(mod, {
    ssr,
    route
  });
  if (ssr && !route.prerender || route.origin === "internal") {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, {
      ...cached2,
      mod,
      staticPaths: entry
    });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) throw new Error("Unexpected Error.");
  staticPaths = await mod.getStaticPaths({
    paginate: generatePaginateFunction(route, base, trailingSlash),
    routePattern: route.route
  });
  validateGetStaticPathsResult(staticPaths, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route, trailingSlash);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, {
    ...cached2,
    mod,
    staticPaths: keyedStaticPaths
  });
  return keyedStaticPaths;
}
var RouteCache = class {
  logger;
  cache = {};
  runtimeMode;
  constructor(logger, runtimeMode = "production") {
    this.logger = logger;
    this.runtimeMode = runtimeMode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    const key = this.key(route);
    if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
    this.cache[key] = entry;
  }
  get(route) {
    return this.cache[this.key(route)];
  }
  key(route) {
    return `${route.route}_${route.component}`;
  }
};
var routeCaches = createManifestMemo((manifest2) => new RouteCache(getLogger(manifest2), getEnvironment(manifest2).runtimeMode));
function getRouteCache(manifest2) {
  return routeCaches.get(manifest2);
}
function findPathItemByKey(staticPaths, params, route, logger, trailingSlash) {
  const paramsKey = stringifyParams(params, route, trailingSlash);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) return matchedStaticPath;
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike, base, trailingSlash } = opts;
  if (!route || route.pathname) return {};
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === "astro-default-404.astro") return {};
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    ssr: serverLike,
    base,
    trailingSlash
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger, trailingSlash);
  if (!matchedStaticPath && route.origin !== "internal" && (serverLike ? route.prerender : true)) throw new AstroError({
    ...NoMatchingStaticPathFound,
    message: NoMatchingStaticPathFound.message(pathname),
    hint: NoMatchingStaticPathFound.hint([route.component])
  });
  if (mod) validatePrerenderEndpointCollision(route, mod, params);
  return matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const hasHtmlSuffix = pathname.endsWith(".html") && !routeHasHtmlExtension(route);
  const path = hasHtmlSuffix && route.type === "page" ? pathname.slice(0, -5) : pathname;
  const allPatterns = [route, ...route.fallbackRoutes].map((r5) => r5.pattern);
  let paramsMatch = allPatterns.map((pattern) => pattern.exec(path)).find((x4) => x4);
  if (!paramsMatch && hasHtmlSuffix && route.type !== "page") {
    const strippedPath = pathname.endsWith("/index.html") ? pathname.slice(0, -11) || "/" : pathname.slice(0, -5);
    paramsMatch = allPatterns.map((pattern) => pattern.exec(strippedPath)).find((x4) => x4);
  }
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i5) => {
    if (key.startsWith("...")) params[key.slice(3)] = paramsMatch[i5 + 1] ? paramsMatch[i5 + 1] : void 0;
    else params[key] = paramsMatch[i5 + 1];
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) throw new AstroError({
      ...PrerenderDynamicEndpointPathCollide,
      message: PrerenderDynamicEndpointPathCollide.message(route.route),
      hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
      location: { file: route.component }
    });
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e4) => isRenderInstruction(e4) === false || isRenderTemplateResult(e4));
  if (expressions?.length !== 1) return;
  const expression = expressions[0];
  if (isRenderTemplateResult(expression)) return getFunctionExpression(expression);
  return expression;
}
var Slots = class {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) for (const key of Object.keys(slots)) {
      if (this[key] !== void 0) throw new AstroError({
        ...ReservedSlotName,
        message: ReservedSlotName.message(key)
      });
      Object.defineProperty(this, key, {
        get() {
          return true;
        },
        enumerable: true
      });
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) this.#logger.warn(null, `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
    else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") return await renderJSX(result, component(...args)).then((res) => res != null ? String(res) : res);
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    return chunkToString(result, content);
  }
};
function computeFallbackRoute(options) {
  const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy } = options;
  if (responseStatus !== 404) return { type: "none" };
  if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) if (typeof locale === "string") {
      if (locale === segment) return true;
    } else if (locale.path === segment) return true;
    return false;
  });
  if (!urlLocale) return { type: "none" };
  if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  const localeIndex = segments.indexOf(urlLocale);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    segments.splice(localeIndex, 1);
    newPathname = segments.join("/") || "/";
  } else {
    segments[localeIndex] = pathFallbackLocale;
    newPathname = segments.join("/");
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}
var I18nRouter = class {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
  * Evaluate routing strategy for a pathname.
  * Returns decision object (not HTTP Response).
  */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
  * Check if i18n processing should be skipped for this request
  */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) return true;
    if (pathname.includes("/_server-islands/")) return true;
    if (context.isReroute) return true;
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
    return false;
  }
  /**
  * Strategy: pathname-prefix-always
  * All locales must have a prefix, including the default locale.
  */
  matchPrefixAlways(pathname, context) {
    if (pathname === this.#base + "/" || pathname === this.#base) return {
      type: "redirect",
      location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
    };
    if (!context.allowUnprefixedPath && !pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
    return { type: "continue" };
  }
  /**
  * Strategy: pathname-prefix-other-locales
  * Default locale has no prefix, other locales must have a prefix.
  */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
      pathnameContainsDefaultLocale = true;
      break;
    }
    if (pathnameContainsDefaultLocale) return {
      type: "notFound",
      location: pathname.replace(`/${this.#defaultLocale}`, "")
    };
    return { type: "continue" };
  }
  /**
  * Strategy: pathname-prefix-always-no-redirect
  * Like prefix-always but allows root to serve instead of redirecting
  */
  matchPrefixAlwaysNoRedirect(pathname, context) {
    if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
    if (!context.allowUnprefixedPath && !pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
    return { type: "continue" };
  }
  /**
  * Check if the current locale doesn't belong to the configured domain.
  * Used for domain-based routing strategies.
  */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) return false;
    if (!currentLocale) return false;
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) return true;
    return !localesForDomain.includes(currentLocale);
  }
};
function compileI18n(i18n, base, trailingSlash, format) {
  return {
    config: i18n,
    base,
    trailingSlash,
    format,
    router: new I18nRouter({
      strategy: i18n.strategy,
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      base,
      domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
        const locale = i18n.domainLookupTable[domain];
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(locale);
        return acc;
      }, {}) : void 0
    })
  };
}
var i18nMemo = createManifestMemo((manifest2) => {
  const config2 = manifest2.i18n;
  return config2 && config2.strategy !== "manual" ? compileI18n(config2, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat) : null;
});
function getI18n(manifest2) {
  return i18nMemo.get(manifest2);
}
async function finalizeI18n(compiled, state, response) {
  markFeatureUsed(state.manifest, FetchFeatures.i18n);
  const i18n = compiled.config;
  if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
  if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
  const url = state.url;
  const currentLocale = state.computeCurrentLocale();
  const routeData = state.routeData;
  const isPrerendered = routeData.prerender;
  const routerContext = {
    currentLocale,
    currentDomain: url.hostname,
    routeType: state.responseRouteType,
    isReroute: false,
    allowUnprefixedPath: routeData.origin === "external" && !routeData.segments?.[0]?.some((part) => part.dynamic)
  };
  const routeDecision = compiled.router.match(url.pathname, routerContext);
  switch (routeDecision.type) {
    case "redirect": {
      let location = routeDecision.location;
      if (shouldAppendForwardSlash(compiled.trailingSlash, compiled.format)) location = appendForwardSlash(location);
      return new Response(null, {
        status: routeDecision.status ?? 302,
        headers: { Location: location }
      });
    }
    case "notFound": {
      if (isPrerendered) {
        const prerenderedRes = new Response(response.body, {
          status: 404,
          headers: response.headers
        });
        state.skipErrorReroute = true;
        if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
        return prerenderedRes;
      }
      const headers = new Headers();
      if (routeDecision.location) headers.set("Location", routeDecision.location);
      return new Response(null, {
        status: 404,
        headers
      });
    }
  }
  if (i18n.fallback && i18n.fallbackType) {
    const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
    const fallbackDecision = computeFallbackRoute({
      pathname: url.pathname,
      responseStatus: effectiveStatus,
      currentLocale,
      fallback: i18n.fallback,
      fallbackType: i18n.fallbackType,
      locales: i18n.locales,
      defaultLocale: i18n.defaultLocale,
      strategy: i18n.strategy,
      base: compiled.base
    });
    switch (fallbackDecision.type) {
      case "redirect":
        return new Response(null, {
          status: 302,
          headers: { Location: fallbackDecision.pathname + url.search }
        });
      case "rewrite":
        try {
          return await state.rewrite(fallbackDecision.pathname + url.search);
        } catch {
          break;
        }
    }
  }
  return response;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) if (typeof loopLocale === "string") {
    if (loopLocale === locale) return loopLocale;
  } else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
  else result.push(...loopLocale.codes);
  return result;
}
function parseLocale(header) {
  if (header === "*") return [{
    locale: header,
    qualityValue: void 0
  }];
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) continue;
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
        locale: localeName,
        qualityValue: void 0
      });
      else result.push({
        locale: localeName,
        qualityValue: qualityValueAsFloat
      });
    } else result.push({
      locale: localeName,
      qualityValue: void 0
    });
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    return true;
  }).sort((a5, b3) => {
    const qa = a5.locale === "*" ? a5.qualityValue ?? 0 : a5.qualityValue ?? 1;
    return (b3.locale === "*" ? b3.qualityValue ?? 0 : b3.qualityValue ?? 1) - qa;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
    if (firstResult && firstResult.locale !== "*") {
      outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
        if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
          result = currentLocale;
          break;
        }
      } else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
        result = currentCode;
        break outer;
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
    else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
        if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
      } else for (const code of loopLocale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(browserLocale.locale)) result.push(code);
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
    if (!segment.includes(locale)) continue;
    if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
  } else if (locale.path === segment) return locale.codes.at(0);
  else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
  for (const locale of locales) if (typeof locale === "string") {
    if (locale === defaultLocale) return locale;
  } else if (locale.path === defaultLocale) return locale.codes.at(0);
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
  else {
    byPath.set(locale.path, locale.codes[0]);
    for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}
function prepareResponse(response, { addCookieHeader }) {
  if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
  Reflect.set(response, responseSentSymbol, true);
}
var EMPTY_SLOTS = Object.freeze({});
async function handlePages(state, ctx) {
  const { logger, streaming } = state;
  state.resetResponseMetadata();
  let response;
  const componentInstance = await state.loadComponentInstance();
  switch (state.routeData.type) {
    case "endpoint":
      response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
      break;
    case "page": {
      const props = await state.getProps();
      const actionApiContext = state.getActionAPIContext();
      const result = await state.createResult(componentInstance, actionApiContext);
      try {
        response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
      } catch (e4) {
        result.cancelled = true;
        throw e4;
      }
      state.responseRouteType = "page";
      if (state.routeData.route === "/404" || state.routeData.route === "/500") state.skipErrorReroute = true;
      break;
    }
    case "redirect":
      return new Response(null, {
        status: 404,
        headers: { [ASTRO_ERROR_HEADER]: "true" }
      });
    case "fallback":
      state.responseRouteType = "fallback";
      return new Response(null, { status: 500 });
  }
  const responseCookies = getCookiesFromResponse(response);
  if (responseCookies) state.cookies.merge(responseCookies);
  state.response = response;
  return response;
}
function matchRoute$1(pathname, manifest2) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) manifest2.routes.push(DEFAULT_404_ROUTE);
  return manifest2;
}
function routeComparator(a5, b3) {
  const commonLength = Math.min(a5.segments.length, b3.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a5.segments[index];
    const bSegment = b3.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) return aContent.localeCompare(bContent);
    }
    if (aIsStatic !== bIsStatic) return aIsStatic ? -1 : 1;
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bSegment.every((part) => part.dynamic)) return aAllDynamic ? 1 : -1;
    const aHasSpread = aSegment.some((part) => part.spread);
    if (aHasSpread !== bSegment.some((part) => part.spread)) return aHasSpread ? 1 : -1;
  }
  const aLength = a5.segments.length;
  const bLength = b3.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a5.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b3.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) return 1;
      if (bLength > aLength && bEndsInRest) return -1;
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a5.type === "endpoint" !== (b3.type === "endpoint")) return a5.type === "endpoint" ? -1 : 1;
  return a5.route.localeCompare(b3.route);
}
var Router = class {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
  * Match an input pathname against the route list.
  * If allowWithoutBase is true, a non-base-prefixed path is still considered.
  */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) return {
      type: "redirect",
      location: normalized.redirect,
      status: 301
    };
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) return {
        type: "redirect",
        location: baseWithSlash,
        status: 301
      };
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) return {
        type: "redirect",
        location: this.#baseWithoutTrailingSlash,
        status: 301
      };
    }
    const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
    if (!baseResult) {
      if (!allowWithoutBase) return {
        type: "none",
        reason: "outside-base"
      };
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) return {
      type: "none",
      reason: "no-match"
    };
    return {
      type: "match",
      route,
      params: getParams(route, pathname),
      pathname
    };
  }
  /**
  * Returns all routes that match the given pathname, in priority order.
  * Used when the first match (e.g. a prerendered route) cannot serve
  * the request and subsequent matches need to be tried.
  */
  matchAll(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) return [];
    const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
    if (!baseResult && !allowWithoutBase) return [];
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
    return this.#routes.filter((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
  }
};
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) return {
    pathname: value,
    redirect: `/${value.replace(/^\/+/, "")}`
  };
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) return trailingSlash === "always" ? null : "/";
  if (pathname === baseWithSlash) return trailingSlash === "never" ? null : "/";
  if (pathname.startsWith(baseWithSlash)) return pathname.slice(baseWithoutTrailingSlash.length);
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -11);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -5);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}
function compileRouteTable(manifest2, routes) {
  const routesList = ensure404Route({ routes });
  const router = new Router(routesList.routes, {
    base: manifest2.base,
    trailingSlash: manifest2.trailingSlash,
    buildFormat: manifest2.buildFormat
  });
  return {
    routes: routesList.routes,
    router
  };
}
var routeTables = createManifestMemo((manifest2) => compileRouteTable(manifest2, (manifest2.routes ?? []).map((route) => route.routeData)));
function getRouteTable(manifest2) {
  return routeTables.get(manifest2);
}
function updateRouteTable(manifest2, routes) {
  routeTables.set(manifest2, compileRouteTable(manifest2, [...routes]));
}
function matchRoute(manifest2, pathname) {
  const match = getRouteTable(manifest2).router.match(pathname, { allowWithoutBase: true });
  if (match.type !== "match") return void 0;
  return match.route;
}
function matchAllRoutes(manifest2, pathname) {
  return getRouteTable(manifest2).router.matchAll(pathname, { allowWithoutBase: true });
}
function provideSession(state) {
  markFeatureUsed(state.manifest, FetchFeatures.sessions);
}
function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString().split(",").map((e4) => e4.trim())[0];
}
function sanitizeHost(hostname) {
  if (!hostname) return void 0;
  if (/[/\\]/.test(hostname)) return void 0;
  return hostname;
}
function parseHost(host) {
  const parts = host.split(":");
  if (parts.length > 2) return void 0;
  return {
    hostname: parts[0],
    port: parts[1]
  };
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
  const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
  if (!URL.canParse(urlString)) return false;
  const testUrl = new URL(urlString);
  return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
  if (!host || host.length === 0) return void 0;
  if (!allowedDomains || allowedDomains.length === 0) return void 0;
  const sanitized = sanitizeHost(host);
  if (!sanitized) return void 0;
  const parsed = parseHost(sanitized);
  if (!parsed) return void 0;
  const { hostname, port } = parsed;
  if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
  const result = {};
  if (forwardedProtocol) {
    if (allowedDomains && allowedDomains.length > 0) {
      if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
        const testUrl = new URL(`${forwardedProtocol}://example.com`);
        if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
      } catch {
      }
      else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
    }
  }
  if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
    if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
      if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
    }
  }
  if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
    const protoForValidation = result.protocol || "https";
    const sanitized = sanitizeHost(forwardedHost);
    const parsed = sanitized ? parseHost(sanitized) : void 0;
    if (sanitized && parsed) {
      const { hostname, port: portFromHost } = parsed;
      if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
    }
  }
  return result;
}
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set(["/404", "/500"]);
function getOutputFilename(buildFormat, name, routeData) {
  if (routeData.type === "endpoint") return name;
  if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
  if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
  if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
  return `${removeTrailingForwardSlash(name)}/index.html`;
}
async function renderDefaultError(manifest2, request, { status, response: originalResponse, skipMiddleware = false, error: error3, pathname, ...resolvedRenderOptions }) {
  const resolvedPathname = pathname ?? new FetchState(manifest2, request).pathname;
  const routeTable = getRouteTable(manifest2);
  const errorRouteData = matchRoute$1(getErrorRoutePath(resolvedPathname, status, routeTable.routes, manifest2.i18n?.locales, manifest2.trailingSlash === "always"), routeTable);
  const url = new URL(request.url);
  if (errorRouteData) {
    if (errorRouteData.prerender) {
      const allowedDomains = manifest2.allowedDomains;
      const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
      const statusURL = new URL(`${removeTrailingForwardSlash(manifest2.base)}${getOutputFilename(manifest2.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
      if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
        const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
          status,
          removeContentEncodingHeaders: true
        });
        prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        const response2 = mergeResponses(new Response(null, { status }), originalResponse);
        prepareResponse(response2, resolvedRenderOptions);
        return response2;
      }
    }
    const mod = await getEnvironment(manifest2).getComponentByRoute(manifest2, errorRouteData);
    const errorState = new FetchState(manifest2, request);
    errorState.skipMiddleware = skipMiddleware;
    errorState.clientAddress = resolvedRenderOptions.clientAddress;
    errorState.routeData = errorRouteData;
    errorState.pathname = resolvedPathname;
    errorState.status = status;
    errorState.componentInstance = mod;
    errorState.locals = resolvedRenderOptions.locals ?? {};
    errorState.initialProps = { error: error3 };
    try {
      await provideSession(errorState);
      const response2 = await handleMiddleware(errorState, handlePages);
      if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response2)) return renderDefaultError(manifest2, request, {
        ...resolvedRenderOptions,
        status,
        error: error3,
        response: originalResponse,
        skipMiddleware: true,
        pathname: resolvedPathname
      });
      const newResponse = mergeResponses(response2, originalResponse);
      prepareResponse(newResponse, resolvedRenderOptions);
      return newResponse;
    } catch {
      if (skipMiddleware === false) return renderDefaultError(manifest2, request, {
        ...resolvedRenderOptions,
        status,
        error: error3,
        response: originalResponse,
        skipMiddleware: true,
        pathname: resolvedPathname
      });
    } finally {
      await errorState.finalizeAll();
    }
  }
  const response = mergeResponses(new Response(null, { status }), originalResponse);
  prepareResponse(response, resolvedRenderOptions);
  return response;
}
function mergeResponses(newResponse, originalResponse, override) {
  let newResponseHeaders = newResponse.headers;
  if (override?.removeContentEncodingHeaders) {
    newResponseHeaders = new Headers(newResponseHeaders);
    newResponseHeaders.delete("Content-Encoding");
    newResponseHeaders.delete("Content-Length");
  }
  if (!originalResponse) {
    if (override !== void 0) return new Response(newResponse.body, {
      status: override.status,
      statusText: newResponse.statusText,
      headers: newResponseHeaders
    });
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
    originalResponse.headers.delete("Content-Length");
    originalResponse.headers.delete("Transfer-Encoding");
  } catch {
  }
  const newHeaders = new Headers();
  const seen = /* @__PURE__ */ new Set();
  for (const [name, value] of originalResponse.headers) {
    newHeaders.append(name, value);
    seen.add(name.toLowerCase());
  }
  for (const [name, value] of newResponseHeaders) {
    const lower = name.toLowerCase();
    if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
  }
  const mergedResponse = new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    headers: newHeaders
  });
  const originalCookies = getCookiesFromResponse(originalResponse);
  const newCookies = getCookiesFromResponse(newResponse);
  if (originalCookies) {
    if (newCookies) originalCookies.merge(newCookies);
    attachCookiesToResponse(mergedResponse, originalCookies);
  } else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
  return mergedResponse;
}
async function renderBuildError(manifest2, request, options) {
  if (options.status === 500) {
    if (options.response) return options.response;
    throw options.error;
  }
  return renderDefaultError(manifest2, request, {
    ...options,
    prerenderedErrorPageFetch: void 0
  });
}
async function renderDevError(manifest2, request, { skipMiddleware = false, error: error3, status, response: _response, pathname, ...resolvedRenderOptions }, { shouldInjectCspMetaTags }) {
  if (isAstroError(error3) && [MiddlewareNoDataOrNextCalled.name, MiddlewareNotAResponse.name].includes(error3.name)) throw error3;
  const resolvedPathname = pathname ?? new FetchState(manifest2, request).pathname;
  const renderRoute = async (routeData) => {
    try {
      const preloadedComponent = await getEnvironment(manifest2).getComponentByRoute(manifest2, routeData);
      const errorState = new FetchState(manifest2, request);
      errorState.skipMiddleware = skipMiddleware;
      errorState.clientAddress = resolvedRenderOptions.clientAddress;
      errorState.shouldInjectCspMetaTags = shouldInjectCspMetaTags ? !!manifest2.csp : false;
      errorState.routeData = routeData;
      errorState.pathname = resolvedPathname;
      errorState.status = status;
      errorState.componentInstance = preloadedComponent;
      errorState.locals = resolvedRenderOptions.locals ?? {};
      errorState.initialProps = { error: error3 };
      const response = await handleMiddleware(errorState, handlePages);
      if (rewroteToEmptyErrorResponse(skipMiddleware, routeData, errorState.routeData, response)) return renderDevError(manifest2, request, {
        ...resolvedRenderOptions,
        status,
        error: error3,
        skipMiddleware: true,
        pathname: resolvedPathname
      }, { shouldInjectCspMetaTags });
      if (error3) getLogger(manifest2).error("router", error3.stack || error3.message);
      return response;
    } catch (_err) {
      if (skipMiddleware === false) return renderDevError(manifest2, request, {
        ...resolvedRenderOptions,
        status: 500,
        skipMiddleware: true,
        error: _err,
        pathname: resolvedPathname
      }, { shouldInjectCspMetaTags });
      throw _err;
    }
  };
  if (status === 404) {
    const custom404 = getCustom404Route(getRouteTable(manifest2));
    if (custom404) return renderRoute(custom404);
  }
  const custom500 = getCustom500Route(getRouteTable(manifest2));
  if (!custom500) throw error3;
  else return renderRoute(custom500);
}
function renderErrorPage(manifest2, request, options) {
  const env = getEnvironment(manifest2);
  switch (env.errorStrategy) {
    case "dev":
      return renderDevError(manifest2, request, options, { shouldInjectCspMetaTags: env.injectCspMetaTagsOnErrorPages });
    case "build":
      return renderBuildError(manifest2, request, options);
    case "default":
      return renderDefaultError(manifest2, request, options);
  }
}
function renderErrorFromState(state, request, options) {
  if (state.renderError) return state.renderError(request, options);
  return renderErrorPage(state.manifest, request, options);
}
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
  return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
        return value;
      } else if (responseFunctionPromise) return responseFunctionPromise;
      else throw new AstroError(MiddlewareNotAResponse);
    } else if (typeof value === "undefined") throw new AstroError(MiddlewareNoDataOrNextCalled);
    else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
    else return value;
  });
}
function sequence(...handlers2) {
  const filtered = handlers2.filter((h3) => !!h3);
  const length = filtered.length;
  if (!length) return defineMiddleware((_context, next) => {
    return next();
  });
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i5, handleContext) {
      const handle2 = filtered[i5];
      return handle2(handleContext, async (payload) => {
        if (i5 < length - 1) {
          if (payload) {
            const oldPathname = handleContext.url.pathname;
            const state = Reflect.get(handleContext, fetchStateSymbol);
            if (!state) throw new Error("FetchState not found on APIContext. `next(payload)` rewrites require a context created through Astro's request pipeline.");
            const manifest2 = state.manifest;
            const { routeData, pathname } = await getEnvironment(manifest2).tryRewrite(manifest2, payload, handleContext.request);
            let newRequest;
            if (payload instanceof Request) newRequest = payload;
            else {
              const request = handleContext.request.method === "GET" || handleContext.request.method === "HEAD" ? handleContext.request : handleContext.request.clone();
              newRequest = copyRequest(payload instanceof URL ? payload : new URL(payload, handleContext.url.origin), request, false, state.logger, routeData.route);
            }
            if (manifest2.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) throw new AstroError({
              ...ForbiddenRewrite,
              message: ForbiddenRewrite.message(handleContext.url.pathname, pathname, routeData.component),
              hint: ForbiddenRewrite.hint(routeData.component)
            });
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(handleContext.request, oldPathname, manifest2.trailingSlash, manifest2.buildFormat);
          }
          return applyHandle(i5 + 1, handleContext);
        } else return next(payload ?? carriedPayload);
      });
    }
  });
}
var resolvedMiddleware = /* @__PURE__ */ new WeakMap();
var middlewareMemo = createAsyncManifestMemo(async (manifest2) => {
  let handler;
  if (manifest2.middleware) {
    const internalMiddlewares = [(await manifest2.middleware()).onRequest ?? NOOP_MIDDLEWARE_FN];
    if (manifest2.checkOrigin) internalMiddlewares.unshift(createOriginCheckMiddleware());
    handler = sequence(...internalMiddlewares);
  } else handler = NOOP_MIDDLEWARE_FN;
  resolvedMiddleware.set(manifest2, handler);
  return handler;
});
function getMiddleware(manifest2) {
  return middlewareMemo.get(manifest2);
}
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
};
var hasWarned = false;
var DisabledAstroCache = class {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
};
async function handleMiddleware(state, renderRouteCallback) {
  markFeatureUsed(state.manifest, FetchFeatures.middleware);
  await state.getProps();
  const apiContext = state.getAPIContext();
  state.counter++;
  if (state.counter === 4) return new Response("Loop Detected", {
    status: 508,
    statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
  });
  const next = async (ctx, payload) => {
    if (payload) {
      state.logger.debug("router", "Called rewriting to:", payload);
      applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request));
    }
    return renderRouteCallback(state, ctx);
  };
  let response;
  if (state.skipMiddleware) response = await next(apiContext);
  else response = await callMiddleware(sequence(await getMiddleware(state.manifest)), apiContext, next);
  attachCookiesToResponse(response, state.cookies);
  state.response = response;
  return response;
}
function createNormalizedUrl(requestUrl) {
  return normalizeUrl(new URL(requestUrl));
}
function setPathname(url, pathname) {
  if (url.pathname !== pathname) url.pathname = pathname;
}
function normalizeUrl(url) {
  try {
    setPathname(url, validateAndDecodePathname(url.pathname));
  } catch {
    try {
      setPathname(url, decodeURI(url.pathname));
    } catch {
    }
  }
  setPathname(url, collapseDuplicateSlashes(url.pathname));
  return url;
}
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
  const oldPathname = state.pathname;
  const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
  if (state.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
    ...ForbiddenRewrite,
    message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
    hint: ForbiddenRewrite.hint(routeData.component)
  });
  state.routeData = routeData;
  state.componentInstance = componentInstance;
  if (payload instanceof Request) state.request = payload;
  else state.request = copyRequest(newUrl, state.request, routeData.prerender, state.logger, state.routeData.route);
  state.url = createNormalizedUrl(state.request.url);
  if (mergeCookies) {
    const newCookies = new AstroCookies(state.request, state.logger);
    if (state.cookies) newCookies.merge(state.cookies);
    state.cookies = newCookies;
  }
  state.params = getParams(routeData, pathname);
  state.pathname = pathname;
  state.isRewriting = true;
  state.status = 200;
  setOriginPathname(state.request, oldPathname, state.manifest.trailingSlash, state.manifest.buildFormat);
  state.invalidateContexts();
}
async function executeRewrite(state, payload) {
  state.logger.debug("router", "Calling rewrite: ", payload);
  applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request), { mergeCookies: true });
  return handleMiddleware(state, handlePages);
}
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, allowedDomains, logger, pathnameFromRequest) {
  let pathname = void 0;
  if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
    const validated = validateForwardedHeaders(getFirstForwardedValue(request.headers.get("X-Forwarded-Proto") ?? void 0), getFirstForwardedValue(request.headers.get("X-Forwarded-Host") ?? void 0), getFirstForwardedValue(request.headers.get("X-Forwarded-Port") ?? void 0), allowedDomains);
    const protocol = validated.protocol ? `${validated.protocol}:` : url.protocol;
    const requestHost = request.headers.get("Host") ?? void 0;
    const validatedRequestHost = allowedDomains?.length ? validateHost(requestHost, protocol.slice(0, -1), allowedDomains) : requestHost;
    let host = validated.host ?? validatedRequestHost;
    if (host && protocol) {
      host = host.split(":")[0];
      try {
        let locale;
        const hostAsUrl = new URL(`${protocol}//${host}`);
        for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
          const domainKeyAsUrl = new URL(domainKey);
          if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
            locale = localeValue;
            break;
          }
        }
        if (locale) {
          const requestPathname = pathnameFromRequest ?? stripRequestBase(url.pathname, base);
          pathname = prependForwardSlash(joinPaths(normalizeTheLocale(locale), requestPathname));
          if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
          else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
          else if (url.pathname.endsWith("/")) pathname = appendForwardSlash(pathname);
        }
      } catch (e4) {
        logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
        logger.error("router", `Error: ${e4}`);
      }
    }
  }
  return pathname;
}
var sites = createManifestMemo((manifest2) => manifest2.site ? new URL(manifest2.site) : void 0);
function getSite(manifest2) {
  return sites.get(manifest2);
}
async function getServerIslands(manifest2) {
  if (manifest2.serverIslandMappings) return manifest2.serverIslandMappings();
  return {
    serverIslandMap: /* @__PURE__ */ new Map(),
    serverIslandNameMap: /* @__PURE__ */ new Map()
  };
}
var slotValuesSymbol = /* @__PURE__ */ Symbol("astro.slotValues");
function getFetchStateFromAPIContext(context) {
  const state = context[fetchStateSymbol];
  if (!state) throw new Error("FetchState not found on APIContext. This is an internal error \u2014 the context was not created through Astro's request pipeline.");
  return state;
}
var FetchState = class {
  /** The manifest — the single ambient source of static, build-time data. */
  manifest;
  /** The manifest's identity-stable logger, captured once at construction. */
  logger;
  /**
  * Whether page renders stream. From the facade hooks on the fast path,
  * else the environment's default.
  */
  streaming;
  /**
  * Internal facade hook: late-bound `app.renderError` dispatch. Undefined on
  * bare and custom-handler paths — those fall through to the environment's
  * error strategy (`renderErrorPage`).
  */
  renderError;
  /**
  * Internal facade hook: late-bound `app.logThisRequest` dispatch. Undefined
  * on bare and custom-handler paths — those fall through to the
  * environment's `logRequest` behavior.
  */
  logRequest;
  /**
  * The request to render. Mutated during rewrites so subsequent renders
  * see the rewritten URL.
  */
  request;
  routeData;
  /**
  * The pathname to use for routing and rendering. Starts out as the raw,
  * base-stripped, decoded pathname from the request. May be further
  * normalized by `handleRequest` after routeData is known (in dev, when
  * the matched route has no `.html` extension, `.html` / `/index.html`
  * suffixes are stripped).
  */
  pathname;
  /** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
  renderOptions;
  /** When the request started, used to log duration. */
  timeStart;
  /**
  * The route's loaded component module. Set before middleware runs; may
  * be swapped during in-flight rewrites from inside the middleware chain.
  */
  componentInstance;
  /**
  * Slot overrides supplied by the container API. `undefined` for HTTP
  * requests — `PagesHandler` coalesces to `{}` on read so we don't
  * allocate an empty object per request.
  */
  slots;
  /**
  * The `Response` produced by handlers, if any. Set after page
  * rendering or middleware completes.
  */
  response;
  /** Explicitly assigned status; `undefined` until a caller sets one. */
  #status;
  /**
  * Default HTTP status for the rendered response. Callers override
  * before rendering runs (e.g. `handleRequest` sets this from
  * `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
  * Reads `200` until assigned.
  */
  get status() {
    return this.#status ?? 200;
  }
  set status(value) {
    this.#status = value;
  }
  /**
  * Sets `status` from the matched route (see `getDefaultStatusCode`)
  * unless a caller already assigned one.
  */
  applyDefaultStatus() {
    if (this.#status === void 0 && this.routeData) this.#status = getDefaultStatusCode(this.manifest, this.routeData, this.pathname);
  }
  /** Whether user middleware should be skipped for this request. */
  skipMiddleware = false;
  /**
  * Set to `true` when the request path was encoded too many times to fully
  * decode (see {@link validateAndDecodePathname}). These requests are
  * rejected with a `400` before middleware or routing run.
  */
  invalidEncoding = false;
  /** A flag that tells the render content if the rewriting was triggered. */
  isRewriting = false;
  /** A safety net in case of loops (rewrite counter). */
  counter = 0;
  /** Cookies for this request. Created lazily on first access. */
  cookies;
  /** Route params derived from routeData + pathname. Computed lazily. */
  #params;
  get params() {
    if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
    return this.#params;
  }
  set params(value) {
    this.#params = value;
  }
  /** Normalized URL for this request. */
  url;
  /** Client address for this request. */
  clientAddress;
  /** Whether this is a partial render (container API). */
  partial;
  /** Internal metadata about the current response route type. */
  responseRouteType;
  /** Internal flag to prevent rerouting this response to an error page. */
  skipErrorReroute = false;
  /** Whether to inject CSP meta tags. */
  shouldInjectCspMetaTags;
  /** Request-scoped locals object, shared with user middleware. */
  locals = {};
  /**
  * Memoized `props` (see `getProps`). `null` means "not yet computed"
  * — using `null` (rather than `undefined`) keeps the hidden class
  * stable and distinct from a valid-but-empty result.
  */
  props = null;
  /** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
  actionApiContext = null;
  /** Memoized `APIContext` (see `getAPIContext`). */
  apiContext = null;
  /** Registered context providers keyed by name. Lazy-initialized on first provide(). */
  #providers;
  /** Cached values from resolved providers. Lazy-initialized on first resolve(). */
  #providersResolvedValues;
  /** Cached promise for lazy component instance loading. */
  #componentInstancePromise;
  /** SSR result for the current page render. */
  result;
  /** Initial props (from container/error handler). */
  initialProps = {};
  /** Memoized Astro page partial. */
  #astroPagePartial;
  /**
  * Locale-prefixed pathname derived from the Host header for domain-based
  * i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
  * isn't served from a locale-mapped domain. When set, `this.pathname` is
  * derived from it so locale/param resolution match the route pattern.
  */
  #domainPathname;
  /** Memoized current locale. */
  #currentLocale;
  /** Memoized preferred locale. */
  #preferredLocale;
  /** Memoized preferred locale list. */
  #preferredLocaleList;
  constructor(manifest2, request, options, hooks) {
    this.manifest = manifest2;
    this.logger = getLogger(manifest2);
    this.streaming = hooks?.streaming ?? getEnvironment(manifest2).defaultStreaming(manifest2);
    this.renderError = hooks?.renderError;
    this.logRequest = hooks?.logRequest;
    this.request = request;
    options ??= getRenderOptions(request);
    this.routeData = options?.routeData;
    const self = this;
    this.renderOptions = {
      ...options ?? {
        addCookieHeader: false,
        clientAddress: void 0,
        prerenderedErrorPageFetch: fetch,
        routeData: void 0,
        waitUntil: void 0
      },
      get locals() {
        return self.locals;
      }
    };
    this.componentInstance = void 0;
    this.slots = void 0;
    const url = new URL(request.url);
    const publicPathname = this.#normalizePathname(url.pathname);
    const pathname = this.#computePathname(publicPathname);
    setPathname(url, publicPathname);
    setPathname(url, collapseDuplicateSlashes(url.pathname));
    const domainPathname = computePathnameFromDomain(request, url, manifest2.i18n, manifest2.base, manifest2.trailingSlash, manifest2.allowedDomains, this.logger, pathname);
    if (domainPathname) {
      this.#domainPathname = domainPathname;
      this.pathname = domainPathname;
    } else this.pathname = pathname;
    this.timeStart = performance.now();
    this.clientAddress = options?.clientAddress;
    this.locals = options?.locals ?? {};
    this.url = url;
    this.cookies = new AstroCookies(request, this.logger);
    if (manifest2.allowedDomains && manifest2.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
    if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, manifest2.trailingSlash, manifest2.buildFormat);
    this.#resolveRouteData();
  }
  /**
  * Triggers a rewrite. Delegates to the rewrites handler module.
  */
  rewrite(payload) {
    return executeRewrite(this, payload);
  }
  /**
  * Creates the SSR result for the current page render.
  */
  async createResult(mod, ctx) {
    const manifest2 = this.manifest;
    const env = getEnvironment(manifest2);
    const { clientDirectives, inlinedScripts, compressHTML } = manifest2;
    const renderers2 = env.getRenderers(manifest2);
    const resolve = (specifier) => env.resolve(manifest2, specifier);
    const routeData = this.routeData;
    const { links, scripts, styles } = await env.headElements(manifest2, routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest2.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
    }
    const componentMetadata = await env.componentMetadata(manifest2, routeData) ?? manifest2.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial2 = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const status = this.status;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      set headers(_4) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const state = this;
    const result = {
      base: manifest2.base,
      userAssetsBase: manifest2.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies: this.cookies,
      createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
      links,
      params: this.params,
      partial: partial2,
      pathname: this.pathname,
      renderers: renderers2,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      async getServerIslandNameMap() {
        return (await getServerIslands(manifest2)).serverIslandNameMap ?? /* @__PURE__ */ new Map();
      },
      key: manifest2.key,
      trailingSlash: manifest2.trailingSlash,
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set(),
        routeHasPropagation: false,
        pendingSlotEvaluations: [],
        templateDepth: 0
      },
      cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
      scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
      scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
      styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
      styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
      isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
      scriptDirective: {
        resources: manifest2.csp?.scriptDirective ? [...manifest2.csp.scriptDirective.resources] : [],
        hashes: manifest2.csp?.scriptDirective ? [...manifest2.csp.scriptDirective.hashes] : [],
        strictDynamic: manifest2.csp?.scriptDirective?.strictDynamic ?? false
      },
      styleDirective: {
        resources: manifest2.csp?.styleDirective ? [...manifest2.csp.styleDirective.resources] : [],
        hashes: manifest2.csp?.styleDirective ? [...manifest2.csp.styleDirective.hashes] : []
      },
      speculationRulesContent: manifest2.csp?.speculationRulesContent,
      internalFetchHeaders: manifest2.internalFetchHeaders
    };
    this.result = result;
    return result;
  }
  /**
  * Creates the Astro global object for a component render.
  */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    astroPagePartial = this.#astroPagePartial;
    const Astro = Object.assign(Object.create(astroPagePartial), {
      props,
      self: null
    });
    Object.defineProperty(Astro, slotValuesSymbol, {
      value: slotValues,
      writable: true,
      configurable: true,
      enumerable: false
    });
    return Astro;
  }
  /**
  * Creates the Astro page-level partial (prototype for Astro global).
  */
  createAstroPagePartial(result, apiContext) {
    const state = this;
    const { cookies, locals, params, logger, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (state.request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
      return new Response(null, {
        status,
        headers: { Location: path }
      });
    };
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    const partial2 = {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get slots() {
        const slotsByAstro = result._metadata.slotsByAstro ??= /* @__PURE__ */ new WeakMap();
        let slots = slotsByAstro.get(this);
        if (slots === void 0) {
          slots = new Slots(result, this[slotValuesSymbol] ?? null, logger);
          slotsByAstro.set(this, slots);
        }
        return slots;
      },
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: getSite(this.manifest),
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        return astroToRuntimeLogger(logger);
      }
    };
    this.defineProviderGetters(partial2);
    return partial2;
  }
  getClientAddress() {
    const { clientAddress } = this;
    const routeData = this.routeData;
    if (routeData.prerender) throw new AstroError({
      ...PrerenderClientAddressNotAvailable,
      message: PrerenderClientAddressNotAvailable.message(routeData.component)
    });
    if (clientAddress) return clientAddress;
    if (this.manifest.adapterName) throw new AstroError({
      ...ClientAddressNotAvailable,
      message: ClientAddressNotAvailable.message(this.manifest.adapterName)
    });
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  getCookies() {
    return this.cookies;
  }
  getCsp() {
    const state = this;
    if (!this.manifest.csp) {
      if (getEnvironment(this.manifest).runtimeMode === "production") this.logger.warn("csp", `context.csp was used when rendering the route ${s.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
      return;
    }
    const warnedFallback = /* @__PURE__ */ new Set();
    const warnFallback = (family, kind) => {
      if (kind === "default" || !state.result) return;
      const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
      if (defaultResources.length === 0) return;
      const key = `${family}:${kind}`;
      if (warnedFallback.has(key)) return;
      warnedFallback.add(key);
      const general = `${family}-src`;
      const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
      state.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
    };
    return {
      insertDirective(payload) {
        if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
      },
      insertScriptResource(payload) {
        if (!state.result) return;
        warnFallback("script", normalizeCspResourceEntry(payload).kind);
        state.result.scriptDirective.resources.push(payload);
      },
      insertStyleResource(payload) {
        if (!state.result) return;
        warnFallback("style", normalizeCspResourceEntry(payload).kind);
        state.result.styleDirective.resources.push(payload);
      },
      insertStyleHash(payload) {
        state.result?.styleDirective.hashes.push(payload);
      },
      insertScriptHash(payload) {
        state.result?.scriptDirective.hashes.push(payload);
      }
    };
  }
  computeCurrentLocale() {
    const { url, manifest: { i18n }, routeData } = this;
    if (!i18n || !routeData) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) return this.#currentLocale;
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) referer = new URL(referer).pathname;
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (this.#domainPathname) pathname = this.pathname;
      else if (url && !routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
          pathname = fallbackRoute.pathname;
          break;
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) computedLocale = localeFromParams;
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  computePreferredLocale() {
    const { manifest: { i18n }, request } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  computePreferredLocaleList() {
    const { manifest: { i18n }, request } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
  /**
  * Lazily loads the route's component module. Returns the cached
  * instance if already loaded. The promise is cached so concurrent
  * callers share the same load.
  */
  async loadComponentInstance() {
    if (this.componentInstance) return this.componentInstance;
    if (this.#componentInstancePromise) return this.#componentInstancePromise;
    this.#componentInstancePromise = getEnvironment(this.manifest).getComponentByRoute(this.manifest, this.routeData).then((mod) => {
      this.componentInstance = mod;
      return mod;
    });
    return this.#componentInstancePromise;
  }
  /**
  * Registers a context provider under the given key. Handlers call
  * this to contribute values to the request context (e.g. sessions).
  * The `create` factory is called lazily on the first `resolve(key)`.
  */
  provide(key, provider) {
    (this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
  }
  /**
  * Lazily resolves a provider registered under `key`. Calls
  * `provider.create()` on first access and caches the result.
  * Returns `undefined` if no provider was registered for the key.
  */
  resolve(key) {
    if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
    const provider = this.#providers?.get(key);
    if (!provider) return void 0;
    const value = provider.create();
    (this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
    return value;
  }
  /**
  * Runs all registered `finalize` callbacks. Should be called after
  * the response is produced, typically in a `finally` block.
  *
  * Returns synchronously (no promise allocation) when nothing needs
  * finalizing — important for the hot path where sessions are not used.
  */
  finalizeAll() {
    if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
    let chain;
    for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
      const result = provider.finalize(this.#providersResolvedValues.get(key));
      if (result) chain = chain ? chain.then(() => result) : result;
    }
    return chain;
  }
  /**
  * Adds lazy getters to `target` for each registered provider key.
  * Used by context creation (APIContext, Astro global) so that
  * provider values like `session` and `cache` appear as properties
  * without hard-coding the keys.
  *
  * Always defines a `session` getter (returning `undefined` when no
  * provider is registered) so `ctx.session` / `Astro.session` is a
  * present property regardless of whether the sessions handler was
  * included in the pipeline.
  */
  defineProviderGetters(target) {
    const state = this;
    if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
      get: () => state.resolve(key),
      enumerable: true,
      configurable: true
    });
    if (!this.#providers?.has("session")) {
      let warned = false;
      Object.defineProperty(target, "session", {
        get() {
          if (!warned) {
            warned = true;
            state.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  }
  /**
  * Resolves the route to use for this request and stores it on
  * `this.routeData`. If the adapter (or the dev server) provided a
  * `routeData` via render options it's already set and this is a
  * no-op. Otherwise we use the app's synchronous route matcher and
  * fall back to a `404.astro` route so middleware can still run.
  *
  * Called eagerly from the constructor so individual handlers
  * (actions, pages, middleware, etc.) always see a resolved route
  * without the caller needing an extra setup step.
  *
  * Once routeData is known, finalizes `this.pathname`: in dev, if the
  * matched route has no `.html` extension, strip `.html` / `/index.html`
  * suffixes so the rendering pipeline sees the canonical pathname.
  */
  /**
  * Strip `.html` / `/index.html` suffixes from the pathname so the
  * rendering pipeline sees the canonical route path. Only applies to
  * page routes where `.html` is framework-injected. Endpoint routes
  * preserve `.html` because any such suffix is user-provided (e.g.
  * from `getStaticPaths` params). Skipped when the matched route
  * itself has an `.html` extension in its definition.
  */
  #stripHtmlExtension() {
    if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
      const original = this.pathname;
      this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
      if (this.manifest.trailingSlash === "always" && this.pathname !== "" && !this.pathname.endsWith("/")) this.pathname += "/";
      if (this.pathname !== original && this.routeData.pattern.test(original) && !this.routeData.pattern.test(this.pathname)) this.pathname = original;
    }
  }
  #resolveRouteData() {
    if (this.routeData) {
      this.#stripHtmlExtension();
      return;
    }
    const matched = matchRoute(this.manifest, this.pathname);
    if (matched && matched.prerender && this.manifest.serverLike) {
      if (matched.params.length > 0) {
        const allMatches = matchAllRoutes(this.manifest, this.pathname);
        this.routeData = allMatches.find((r5) => !r5.prerender);
      } else this.routeData = void 0;
    } else this.routeData = matched;
    this.logger.debug("router", "Astro matched the following route for " + this.request.url);
    this.logger.debug("router", "RouteData:\n" + this.routeData);
    if (!this.routeData) {
      const custom404 = getCustom404Route(getRouteTable(this.manifest));
      if (custom404 && !custom404.prerender) this.routeData = custom404;
    }
    if (!this.routeData) {
      this.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
      this.logger.debug("router", "Here's the available routes:\n", getRouteTable(this.manifest));
      return;
    }
    this.#stripHtmlExtension();
  }
  /**
  * Strips the manifest's base from a normalized request pathname and prepends
  * a forward slash.
  *
  * Mirrors `BaseApp.removeBase`: the router matches against this stripped path
  * while middleware reads the un-stripped `context.url.pathname`, so both must
  * strip the base identically.
  */
  #computePathname(normalizedPathname) {
    return prependForwardSlash(stripRequestBase(normalizedPathname, this.manifest.base));
  }
  /**
  * Decodes and normalizes the public request pathname before deriving the
  * separate pathname used for route matching.
  */
  #normalizePathname(pathname) {
    try {
      pathname = validateAndDecodePathname(pathname);
    } catch (e4) {
      if (e4 instanceof MultiLevelEncodingError) this.invalidEncoding = true;
      else this.logger.error(null, e4.toString());
    }
    return collapseDuplicateSlashes(pathname);
  }
  /**
  * Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
  * from the request headers, validates them against the manifest's
  * `allowedDomains`, and updates `this.url` accordingly. Also resolves
  * `clientAddress` from X-Forwarded-For when the host is trusted.
  *
  * Only called when `allowedDomains` is configured — without it,
  * forwarded headers are never trusted.
  */
  #applyForwardedHeaders() {
    const headers = this.request.headers;
    const allowedDomains = this.manifest.allowedDomains;
    const validated = validateForwardedHeaders(getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
    if (!validated.protocol && !validated.host && !validated.port) return;
    if (validated.protocol) this.url.protocol = validated.protocol + ":";
    if (validated.host) {
      const colonIdx = validated.host.indexOf(":");
      if (colonIdx !== -1) {
        this.url.hostname = validated.host.slice(0, colonIdx);
        this.url.port = validated.host.slice(colonIdx + 1);
      } else {
        this.url.hostname = validated.host;
        this.url.port = "";
      }
    }
    if (validated.port) this.url.port = validated.port;
    if (validated.host !== void 0 && !this.clientAddress) {
      const forwardedFor = getFirstForwardedValue(this.request.headers.get("x-forwarded-for") ?? void 0);
      if (forwardedFor) this.clientAddress = forwardedFor;
    }
    this.request = new Request(this.url, this.request);
  }
  /**
  * Returns the resolved `props` for this render, computing them lazily
  * from the route + component module on first access. If the
  * `initialProps` already carries user-supplied props (e.g. the
  * container API) those are used verbatim.
  */
  async getProps() {
    if (this.props !== null) return this.props;
    if (Object.keys(this.initialProps).length > 0) {
      this.props = this.initialProps;
      return this.props;
    }
    const mod = await this.loadComponentInstance();
    this.props = await getProps({
      mod,
      routeData: this.routeData,
      routeCache: getRouteCache(this.manifest),
      pathname: this.pathname,
      logger: this.logger,
      serverLike: this.manifest.serverLike,
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash
    });
    return this.props;
  }
  /**
  * Returns the `ActionAPIContext` for this render, creating it lazily.
  * Used by middleware, actions, and page dispatch.
  */
  getActionAPIContext() {
    if (this.actionApiContext !== null) return this.actionApiContext;
    const state = this;
    const ctx = {
      get cookies() {
        return state.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return state.locals;
      },
      set locals(_4) {
        throw new AstroError(LocalsReassigned);
      },
      params: this.params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      request: this.request,
      site: getSite(this.manifest),
      url: this.url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        return astroToRuntimeLogger(state.logger);
      }
    };
    this.defineProviderGetters(ctx);
    this.actionApiContext = ctx;
    return this.actionApiContext;
  }
  /**
  * Returns the `APIContext` for this render, creating it lazily from
  * the memoized props + action context.
  *
  * Called before `getProps()` has resolved, the context carries
  * `props: null` and is not memoized; the next call after `getProps()`
  * fills in `props` on the same object. Callers that read `props`
  * must await `getProps()` first.
  */
  getAPIContext() {
    if (this.apiContext !== null) return this.apiContext;
    const actionApiContext = this.getActionAPIContext();
    const state = this;
    const redirect = (path, status = 302) => new Response(null, {
      status,
      headers: { Location: path }
    });
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    actionApiContext[fetchStateSymbol] = this;
    const apiContext = Object.assign(actionApiContext, {
      props: this.props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(actionApiContext.locals),
      callAction: createCallAction(actionApiContext)
    });
    if (this.props !== null) this.apiContext = apiContext;
    return apiContext;
  }
  /**
  * Invalidates the cached `APIContext` so the next `getAPIContext()`
  * call re-derives it from the (possibly mutated) state. Used
  * after an in-flight rewrite swaps the route / request / params.
  */
  invalidateContexts() {
    this.props = null;
    this.actionApiContext = null;
    this.apiContext = null;
  }
  resetResponseMetadata() {
    this.responseRouteType = void 0;
    this.skipErrorReroute = false;
  }
};
var FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]);
var NOOP_ACTIONS_MOD = { server: {} };
var actionsMemo = createAsyncManifestMemo(async (manifest2) => manifest2.actions ? await manifest2.actions() : NOOP_ACTIONS_MOD);
function getActions(manifest2) {
  return actionsMemo.get(manifest2);
}
async function getAction(manifest2, path) {
  const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
  let { server: server2 } = await getActions(manifest2);
  if (!server2 || !(typeof server2 === "object")) throw new TypeError(`Expected \`server\` export in actions file to be an object. Received ${typeof server2}.`);
  for (const key of pathKeys) {
    if (typeof server2 === "function") throw new AstroError({
      ...ActionNotFoundError,
      message: ActionNotFoundError.message(pathKeys.join("."))
    });
    if (FORBIDDEN_PATH_KEYS.has(key)) throw new AstroError({
      ...ActionNotFoundError,
      message: ActionNotFoundError.message(pathKeys.join("."))
    });
    if (!Object.hasOwn(server2, key)) throw new AstroError({
      ...ActionNotFoundError,
      message: ActionNotFoundError.message(pathKeys.join("."))
    });
    server2 = server2[key];
  }
  if (typeof server2 !== "function") throw new TypeError(`Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server2}.`);
  return server2;
}
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
    calledFrom: callerInfo.from,
    name: callerInfo.name,
    handler: async () => {
      const { manifest: manifest2 } = getFetchStateFromAPIContext(context);
      const callerInfoName = shouldAppendForwardSlash(manifest2.trailingSlash, manifest2.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
      let baseAction;
      try {
        baseAction = await getAction(manifest2, callerInfoName);
      } catch (error3) {
        if (error3 instanceof Error && "name" in error3 && typeof error3.name === "string" && error3.name === ActionNotFoundError.name) return {
          data: void 0,
          error: new ActionError({ code: "NOT_FOUND" })
        };
        if (error3 instanceof URIError) return {
          data: void 0,
          error: new ActionError({ code: "NOT_FOUND" })
        };
        throw error3;
      }
      const bodySizeLimit = manifest2.actionBodySizeLimit;
      let input;
      try {
        input = await parseRequestBody(context.request, bodySizeLimit);
      } catch (e4) {
        if (e4 instanceof ActionError) return {
          data: void 0,
          error: e4
        };
        if (e4 instanceof TypeError) return {
          data: void 0,
          error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
        };
        if (e4 instanceof SyntaxError) return {
          data: void 0,
          error: new ActionError({
            code: "BAD_REQUEST",
            message: "Invalid JSON request body"
          })
        };
        throw e4;
      }
      const omitKeys = [
        "props",
        "getActionResult",
        "callAction",
        "redirect"
      ];
      const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
      Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
      return baseAction.bind(actionAPIContext)(input);
    }
  };
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === "/_actions/[...path]") return {
    from: "rpc",
    name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
  };
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) return {
    from: "form",
    name: queryParam
  };
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
    code: "CONTENT_TOO_LARGE",
    message: `Request body exceeds ${bodySizeLimit} bytes`
  });
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        return await new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        }).formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e4) {
    if (e4 instanceof BodySizeLimitError) throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
    throw e4;
  }
  throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t4) => type === t4);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign({
      "ASSETS_PREFIX": void 0,
      "BASE_URL": "/",
      "DEV": false,
      "MODE": "production",
      "PROD": true,
      "SITE": void 0,
      "SSR": true
    }, {})?.DEV) actionResultErrorStack.set(res.error.stack);
    let body2;
    if (res.error instanceof ActionInputError) body2 = {
      type: res.error.type,
      issues: res.error.issues,
      fields: res.error.fields
    };
    else body2 = {
      ...res.error,
      message: res.error.message
    };
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) return {
    type: "empty",
    status: 204
  };
  let body;
  try {
    body = stringify(res.data, { URL: (value) => value instanceof URL && value.href });
  } catch (e4) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e4)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
function handleAction(apiContext, state) {
  markFeatureUsed(state.manifest, FetchFeatures.actions);
  const invalidEncodingResponse = rejectInvalidEncoding(state);
  if (invalidEncodingResponse) return Promise.resolve(invalidEncodingResponse);
  if (apiContext.isPrerendered) return;
  const { action, setActionResult } = getActionContext(apiContext);
  if (!action) return;
  if (state.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
  return executeAction(action, setActionResult);
}
async function executeAction(action, setActionResult) {
  const serialized = serializeActionResult(await action.handler());
  if (action.calledFrom === "rpc") {
    if (serialized.type === "empty") return new Response(null, { status: serialized.status });
    return new Response(serialized.body, {
      status: serialized.status,
      headers: { "Content-Type": serialized.contentType }
    });
  }
  setActionResult(action.name, serialized);
}
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
  const delay = status === 302 ? 2 : 0;
  const rel = escape(String(relativeLocation));
  return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
function handleTrailingSlash(state) {
  const invalidEncodingResponse = rejectInvalidEncoding(state);
  if (invalidEncodingResponse) return invalidEncodingResponse;
  const url = new URL(state.request.url);
  const redirect = redirectTrailingSlash(state.manifest.trailingSlash, url.pathname);
  if (redirect === url.pathname) return;
  const addCookieHeader = state.renderOptions.addCookieHeader;
  const status = state.request.method === "GET" ? 301 : 308;
  const location = redirect + url.search;
  const response = new Response(redirectTemplate({
    status,
    relativeLocation: location,
    absoluteLocation: location,
    from: state.request.url
  }), {
    status,
    headers: { location }
  });
  prepareResponse(response, { addCookieHeader });
  return response;
}
function redirectTrailingSlash(trailingSlash, pathname) {
  if (pathname === "/" || isInternalPath(pathname)) return pathname;
  const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
  if (path !== pathname) return path;
  if (trailingSlash === "ignore") return pathname;
  if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
  if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
  return pathname;
}
var cacheProviderMemo = createAsyncManifestMemo(async (manifest2) => {
  if (manifest2.cacheProvider) {
    const factory = (await manifest2.cacheProvider())?.default || null;
    return factory ? factory(manifest2.cacheConfig?.options) : null;
  }
  return null;
});
function getCacheProvider(manifest2) {
  return cacheProviderMemo.get(manifest2);
}
function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
  if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
  if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
  if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
  if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
  if (options.etag) headers.set("ETag", options.etag);
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
var APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
var IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
var AstroCache = class {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else options = input;
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
    }
    if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
  }
  get tags() {
    return [...this.#tags];
  }
  /**
  * Get the current cache options (read-only snapshot).
  * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
  */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) throw new AstroError(CacheNotEnabled);
    let options;
    if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
    else options = input;
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response, request) {
    if (this.#disabled) return;
    const finalOptions = {
      ...this.#options,
      tags: this.tags
    };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) response.headers.set(key, value);
    if (!response.headers.has("Cache-Control") && !response.headers.has("Expires") && (response.headers.has("Last-Modified") || response.headers.has("ETag"))) response.headers.set("Cache-Control", "no-cache");
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
};
function applyCacheHeaders(cache, response, request) {
  if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i5) => {
    if (!str) return;
    const dynamic = i5 % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s5) => getParts(s5, path));
    return {
      pattern: getPattern(segments, base, trailingSlash),
      options,
      segments,
      route: path
    };
  });
  compiled.sort((a5, b3) => routeComparator({
    segments: a5.segments,
    route: a5.route,
    type: "page"
  }, {
    segments: b3.segments,
    route: b3.route,
    type: "page"
  }));
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
  return null;
}
var CACHE_KEY = "cache";
function provideCache(state) {
  const manifest2 = state.manifest;
  if (!manifest2.cacheConfig) {
    state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(state.logger) });
    return;
  }
  if (getEnvironment(manifest2).runtimeMode === "development") {
    state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
    return;
  }
  return provideCacheAsync(state, manifest2);
}
async function provideCacheAsync(state, manifest2) {
  const cacheProvider = await getCacheProvider(manifest2);
  state.provide(CACHE_KEY, { create() {
    const cache = new AstroCache(cacheProvider);
    if (manifest2.cacheConfig?.routes) {
      const matched = matchCacheRoute(state.pathname, getCompiledCacheRoutes(manifest2));
      if (matched) cache.set(matched);
    }
    return cache;
  } });
}
async function handleCache(state, next) {
  markFeatureUsed(state.manifest, FetchFeatures.cache);
  if (!state.manifest.cacheProvider) return next();
  const cache = state.resolve(CACHE_KEY);
  const cacheProvider = await getCacheProvider(state.manifest);
  if (cacheProvider?.onRequest) {
    const response2 = await cacheProvider.onRequest({
      request: state.request,
      url: new URL(state.request.url),
      waitUntil: state.renderOptions.waitUntil,
      logger: {
        info(msg) {
          state.logger.info("cache", msg);
        },
        warn(msg) {
          state.logger.warn("cache", msg);
        },
        error(msg) {
          state.logger.error("cache", msg);
        }
      }
    }, async () => {
      const res = await next();
      applyCacheHeaders(cache, res, state.request);
      return res;
    });
    response2.headers.delete("CDN-Cache-Control");
    response2.headers.delete("Cache-Tag");
    return response2;
  }
  const response = await next();
  applyCacheHeaders(cache, response, state.request);
  return response;
}
var compiledCacheRoutesMemo = createManifestMemo((manifest2) => manifest2.cacheConfig?.routes ? compileCacheRoutes(manifest2.cacheConfig.routes, manifest2.base, manifest2.trailingSlash) : []);
function getCompiledCacheRoutes(manifest2) {
  return compiledCacheRoutesMemo.get(manifest2);
}
function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") return isExternalURL(redirect);
  else return isExternalURL(redirect.destination);
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
  else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) return redirect;
    else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, () => paramValue).replace(`[...${param}]`, () => paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") return "/";
  return redirect.destination;
}
async function renderRedirect(state) {
  markFeatureUsed(state.manifest, FetchFeatures.redirects);
  const { redirect, redirectRoute } = state.routeData;
  const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
  const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.manifest.trailingSlash)) };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") return Response.redirect(redirect, status);
    else return Response.redirect(redirect.destination, status);
  }
  return new Response(null, {
    status,
    headers
  });
}
function logRequestFromState(state, payload) {
  if (state.logRequest) state.logRequest(payload);
  else getEnvironment(state.manifest).logRequest(state.manifest, payload);
}
function actionsAndPages(state, ctx) {
  if (!state.skipMiddleware) {
    const actionResult = handleAction(ctx, state);
    if (actionResult) return actionResult.then((response) => response ?? handlePages(state, ctx));
  }
  return handlePages(state, ctx);
}
async function handleRequest(state) {
  await getResolvedLogger(state.manifest);
  markFeatureUsed(state.manifest, ALL_FETCH_FEATURES);
  const invalidEncodingResponse = rejectInvalidEncoding(state);
  if (invalidEncodingResponse) return invalidEncodingResponse;
  const trailingSlashRedirect = handleTrailingSlash(state);
  if (trailingSlashRedirect) return trailingSlashRedirect;
  if (!state.routeData) return renderErrorFromState(state, state.request, {
    ...state.renderOptions,
    status: 404,
    pathname: state.pathname
  });
  return render(state);
}
async function render(state) {
  const routeData = state.routeData;
  const pathname = state.pathname;
  const request = state.request;
  const { addCookieHeader } = state.renderOptions;
  state.status = getDefaultStatusCode(state.manifest, routeData, pathname);
  let response;
  let finalizeError;
  try {
    const sessionP = state.manifest.sessionConfig ? provideSession(state) : void 0;
    const cacheP = provideCache(state);
    if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
    markFeatureUsed(state.manifest, FetchFeatures.sessions);
    if (routeData.type === "redirect") {
      const redirectResponse = await renderRedirect(state);
      logRequestFromState(state, {
        pathname,
        method: request.method,
        statusCode: redirectResponse.status,
        isRewrite: false,
        timeStart: state.timeStart
      });
      prepareResponse(redirectResponse, { addCookieHeader });
      state.logger.flush();
      return redirectResponse;
    }
    const i18n = getI18n(state.manifest);
    if (!state.manifest.cacheProvider) {
      markFeatureUsed(state.manifest, FetchFeatures.cache);
      response = await handleMiddleware(state, actionsAndPages);
      if (i18n) response = await finalizeI18n(i18n, state, response);
    } else {
      const runPipeline = async () => {
        let res = await handleMiddleware(state, actionsAndPages);
        if (i18n) res = await finalizeI18n(i18n, state, res);
        return res;
      };
      response = await handleCache(state, runPipeline);
    }
    logRequestFromState(state, {
      pathname,
      method: request.method,
      statusCode: response.status,
      isRewrite: state.isRewriting,
      timeStart: state.timeStart
    });
  } catch (err) {
    state.logger.error(null, err.stack || err.message || String(err));
    return renderErrorFromState(state, request, {
      ...state.renderOptions,
      status: 500,
      error: err,
      pathname: state.pathname
    });
  } finally {
    try {
      const finalize2 = state.finalizeAll();
      if (finalize2) await finalize2;
    } catch (err) {
      finalizeError = err;
      state.logger.error(null, err.stack || err.message || String(err));
    }
  }
  if (finalizeError) return renderErrorFromState(state, request, {
    ...state.renderOptions,
    status: 500,
    error: finalizeError,
    pathname: state.pathname
  });
  if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return renderErrorFromState(state, request, {
    ...state.renderOptions,
    response,
    status: response.status,
    error: response.status === 500 ? null : void 0,
    pathname: state.pathname
  });
  prepareResponse(response, { addCookieHeader });
  state.logger.flush();
  return response;
}
var DefaultFetchHandler = class {
  #manifest;
  /**
  * `BaseApp` passes itself so states resolve that app's manifest ahead of
  * the ambient one; generated builds construct the handler with no
  * arguments and use the ambient manifest.
  */
  constructor(app2) {
    this.#manifest = app2?.manifest;
  }
  fetch = (request) => {
    const options = getRenderOptions(request);
    return handleRequest(new FetchState(this.#manifest ?? getAmbientManifest(), request, options));
  };
};
var _virtual_astro_fetchable_default = new DefaultFetchHandler();
function safeDecodePathname(manifest2, pathname) {
  try {
    return validateAndDecodePathname(pathname);
  } catch (e4) {
    new AstroIntegrationLogger(getLogger(manifest2).options, manifest2.adapterName).debug(e4.toString());
    try {
      return decodeURI(pathname);
    } catch {
      return pathname;
    }
  }
}
function matchRequest(manifest2, request, allowPrerenderedRoutes = false) {
  const url = new URL(request.url);
  if (manifest2.assets.has(url.pathname)) return void 0;
  let pathname = computePathnameFromDomain(request, url, manifest2.i18n, manifest2.base, manifest2.trailingSlash, manifest2.allowedDomains, getLogger(manifest2));
  if (!pathname) pathname = prependForwardSlash(stripRequestBase(url.pathname, manifest2.base));
  pathname = safeDecodePathname(manifest2, pathname);
  const routeData = matchRoute(manifest2, pathname);
  if (!routeData) return void 0;
  if (allowPrerenderedRoutes) return routeData;
  if (routeData.prerender) {
    if (routeData.params.length > 0) return matchAllRoutes(manifest2, pathname).find((r5) => !r5.prerender);
    return;
  }
  return routeData;
}
var BaseApp = class BaseApp2 {
  manifest;
  #adapterLogger;
  baseWithoutTrailingSlash;
  /**
  * The streaming flag passed to the constructor, surfaced through the
  * protected `resolveStreaming()` hook and fed into the internal
  * `FetchState` facade hooks on the fast path.
  */
  #streaming;
  /**
  * The handler that turns incoming `Request` objects into `Response`s.
  * Defaults to a `DefaultFetchHandler` pinned to this app and can be
  * overridden via `setFetchHandler` — typically by the bundled
  * entrypoint after importing `virtual:astro:fetchable`.
  */
  #fetchHandler;
  #errorHandler;
  /**
  * Whether a custom fetch handler (from `src/fetch.ts`) has been set
  * via `setFetchHandler`. When false, the `DefaultFetchHandler` is
  * in use and all features are implicitly active.
  */
  #hasCustomFetchHandler = false;
  /**
  * Whether the missing-feature check has already run. We only want
  * to warn once — after the first request in dev, or at build end.
  */
  #featureCheckDone = false;
  get logger() {
    return getLogger(this.manifest);
  }
  /**
  * Route data derived from the manifest, used for route matching. Reads and
  * writes go through the single per-manifest route table, so HMR updates are
  * visible to every consumer at once.
  */
  get manifestData() {
    return getRouteTable(this.manifest);
  }
  set manifestData(routesList) {
    updateRouteTable(this.manifest, routesList.routes);
  }
  get adapterLogger() {
    const currentOptions = this.logger.options;
    if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
    return this.#adapterLogger;
  }
  constructor(manifest2, streaming = true) {
    this.manifest = manifest2;
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest2.base);
    this.#streaming = streaming;
    getRouteTable(manifest2);
    getLogger(manifest2);
    this.#fetchHandler = new DefaultFetchHandler(this);
    this.#errorHandler = this.createErrorHandler();
  }
  /**
  * Resolves the user-configured logger destination from the manifest and
  * returns the logger. Lazy and only resolves once; safe to call before
  * the first render (adapters use this to log startup messages through
  * the configured destination).
  */
  getLogger() {
    return getResolvedLogger(this.manifest);
  }
  /**
  * The streaming flag fed into the internal `FetchState` facade hooks on
  * the fast path. Returns the constructor flag by
  * default; `BuildApp` overrides this to return `undefined` so streaming
  * falls through to the environment default (`manifest.serverLike`).
  */
  resolveStreaming() {
    return this.#streaming;
  }
  /**
  * Override the fetch handler used to dispatch requests. Entrypoints
  * call this with the default export of `virtual:astro:fetchable` to
  * plug in a user-authored handler from `src/fetch.ts`.
  */
  setFetchHandler(handler) {
    this.#fetchHandler = handler;
    this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
  }
  /**
  * Returns the error handler used by this app. The default is a thin
  * bridge over the functional error API — strategy selection (production
  * default / dev / build) is environment-driven inside `renderErrorPage`.
  * External subclasses can override this to customize error rendering.
  */
  createErrorHandler() {
    return { renderError: (request, options) => renderErrorPage(this.manifest, request, options) };
  }
  /**
  * Resets the cached adapter logger so it picks up a new logger instance.
  * Used by BuildApp when the logger is replaced via setOptions().
  */
  resetAdapterLogger() {
    this.#adapterLogger = void 0;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp2.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) return false;
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    updateRouteTable(this.manifest, newManifestData.routes);
  }
  removeBase(pathname) {
    return stripRequestBase(pathname, this.manifest.base);
  }
  /**
  * Fully decodes a pathname, falling back to a single decode and then the raw pathname
  * when validation fails. Adapter matching runs before `render()`, so it must not throw
  * for request input that render-time validation handles.
  */
  safeDecodePathname(pathname) {
    try {
      return validateAndDecodePathname(pathname);
    } catch (e4) {
      this.adapterLogger.debug(e4.toString());
      try {
        return decodeURI(pathname);
      } catch {
        return pathname;
      }
    }
  }
  /**
  * Extracts the base-stripped, decoded pathname from a request.
  * Used by adapters to compute the pathname for dev-mode route matching.
  */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    return this.safeDecodePathname(pathname);
  }
  /**
  * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
  * routes aren't returned, even if they are matched.
  *
  * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
  * @param request
  * @param allowPrerenderedRoutes
  */
  match(request, allowPrerenderedRoutes = false) {
    return matchRequest(this.manifest, request, allowPrerenderedRoutes);
  }
  /**
  * A matching route function to use in the development server.
  * Contrary to the `.match` function, this function resolves props and params, returning the correct
  * route based on the priority, segments. It also returns the correct, resolved pathname.
  * @param pathname
  */
  devMatch(pathname) {
  }
  computePathnameFromDomain(request) {
    return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.manifest.allowedDomains, this.logger);
  }
  async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
    await getResolvedLogger(this.manifest);
    if (routeData) {
      this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error3 = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error3.stack);
        return this.renderError(request, {
          addCookieHeader,
          clientAddress,
          prerenderedErrorPageFetch,
          locals: void 0,
          routeData,
          waitUntil,
          status: 500,
          error: error3
        });
      }
    }
    if (!routeData) {
      const domainPathname = this.computePathnameFromDomain(request);
      if (domainPathname) routeData = matchRoute(this.manifest, this.safeDecodePathname(domainPathname));
    }
    const resolvedOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData,
      waitUntil
    };
    let response;
    if (this.#fetchHandler instanceof DefaultFetchHandler) response = await handleRequest(new FetchState(this.manifest, request, resolvedOptions, {
      streaming: this.resolveStreaming(),
      renderError: (req, opts) => this.renderError(req, opts),
      logRequest: (payload) => this.logThisRequest(payload)
    }));
    else {
      setRenderOptions(request, resolvedOptions);
      response = await this.#fetchHandler.fetch(request);
    }
    this.#warnMissingFeatures();
    if (response.headers.get("X-Astro-Error")) {
      response.headers.delete(ASTRO_ERROR_HEADER);
      return this.renderError(request, {
        addCookieHeader,
        clientAddress,
        prerenderedErrorPageFetch,
        locals,
        routeData,
        waitUntil,
        response,
        status: response.status,
        error: response.status === 500 ? null : void 0
      });
    }
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
  * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
  * For example,
  * ```ts
  * for (const cookie_ of App.getSetCookieFromResponse(response)) {
  *     const cookie: string = cookie_
  * }
  * ```
  * @param response The response to read cookies from.
  * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
  */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
  * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
  * This also handles pre-rendered /404 or /500 routes.
  *
  * Delegates to the app's configured `ErrorHandler`. To customize behavior
  * for a specific environment, override `createErrorHandler()` rather than
  * this method.
  */
  async renderError(request, options) {
    return this.#errorHandler.renderError(request, options);
  }
  /**
  * One-shot check: after the first request with a custom `src/fetch.ts`,
  * compare `usedFeatures` against the manifest and warn about any
  * configured features the user's pipeline doesn't call.
  */
  #warnMissingFeatures() {
    if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
    this.#featureCheckDone = true;
    const manifest2 = this.manifest;
    const missing = [];
    const used = getUsedFeatures(this.manifest);
    if (manifest2.routes.some((r5) => r5.routeData.type === "redirect") && !(used & FetchFeatures.redirects)) missing.push("redirects");
    if (manifest2.sessionConfig && !(used & FetchFeatures.sessions)) missing.push("sessions");
    if (manifest2.actions && !(used & FetchFeatures.actions)) missing.push("actions");
    if (manifest2.middleware && !(used & FetchFeatures.middleware)) missing.push("middleware");
    if (manifest2.i18n && manifest2.i18n.strategy !== "manual" && !(used & FetchFeatures.i18n)) missing.push("i18n");
    if (manifest2.cacheConfig && !(used & FetchFeatures.cache)) missing.push("cache");
    for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless your fetch handler calls it.`);
  }
  getDefaultStatusCode(routeData, pathname) {
    return getDefaultStatusCode(this.manifest, routeData, pathname);
  }
  getManifest() {
    return this.manifest;
  }
  logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
};
var App = class extends BaseApp {
  isDev() {
    return false;
  }
  logRequest(_options) {
  }
};
var createApp$1 = ({ streaming } = {}) => {
  const app2 = new App(manifest, streaming);
  app2.setFetchHandler(_virtual_astro_fetchable_default);
  return app2;
};
var app = createApp$1();
var _server = void 0;
var _startPromise = void 0;
async function start() {
  let trace;
  const handler = async (request) => {
    if (trace === void 0) try {
      trace = (await Promise.resolve().then(() => (init_astro_adapter_CRVyU_0L(), astro_adapter_CRVyU_0L_exports))).trace;
    } catch {
      trace = null;
    }
    const routeData = app.match(request);
    if (routeData) {
      const span = trace?.getActiveSpan();
      span?.updateName(`${request.method} ${routeData.route}`);
      span?.setAttribute("http.route", routeData.route);
      span?.setAttribute("astro.prerendered", routeData.prerender);
      span?.setAttribute("astro.type", routeData.type);
      const hostname = request.headers.get("x-real-ip") || "0.0.0.0";
      Reflect.set(request, /* @__PURE__ */ Symbol.for("astro.clientAddress"), hostname);
      const response2 = await app.render(request, { routeData });
      if (app.setCookieHeaders) for (const setCookieHeader of app.setCookieHeaders(response2)) response2.headers.append("Set-Cookie", setCookieHeader);
      return response2;
    }
    const response = await app.render(request);
    if (app.setCookieHeaders) for (const setCookieHeader of app.setCookieHeaders(response)) response.headers.append("Set-Cookie", setCookieHeader);
    return response;
  };
  //const port = 8085;
  //_server = Deno.serve({
  //  port,
  //  hostname: "0.0.0.0"
  //}, handler);
  Bunny.v1.serve(handler);
  //_startPromise = _server.finished;
  console.error(`Bunny Serve Hooked!`);
}
start();
async function stop() {
  if (_server) {
    _server.shutdown();
    _server = void 0;
  }
  await Promise.resolve(_startPromise);
}
function running() {
  return _server !== void 0;
}
function handle(request) {
  return app.render(request);
}
export {
  handle,
  running,
  start,
  stop
};
/**
* shortdash - https://github.com/bibig/node-shorthash
*
* @license
*
* (The MIT License)
*
* Copyright (c) 2013 Bibig <bibig@me.com>
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
