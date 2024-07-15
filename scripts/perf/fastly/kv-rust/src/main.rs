use fastly::http::{Method, StatusCode};
use fastly::KVStore;
use fastly::SecretStore;
use fastly::{Error, Request, Response};

#[fastly::main]
pub fn main(mut req: Request) -> Result<Response, Error> {
    // Log out which version of the Fastly Service is responding to this request.
    // This is useful to know when debugging.
    // Uncomment the following line once the environment variable integration is supported
    // println!("FASTLY_SERVICE_VERSION: {}", std::env::var("FASTLY_SERVICE_VERSION").unwrap_or_else(|_| "local".to_string()));

    // Check if the request method is allowed
    if !matches!(req.get_method(), &Method::GET | &Method::PUT) {
        return Ok(Response::from_status(StatusCode::METHOD_NOT_ALLOWED)
            .with_body("Method Not Allowed, Bad Human.")
            .with_header(
                "x-fastly-pop",
                std::env::var("FASTLY_POP").unwrap_or_default(),
            ));
    }

    let secrets = SecretStore::open("action-delay-api-secrets")?;
    let api_key = secrets
        .get("APIKEY")
        .expect("API Key exists in Secret Store");

    let api_key_bytes = api_key.plaintext().to_vec();
    let api_key_string = String::from_utf8(api_key_bytes)?;

    // Check if API key in request headers matches the stored API key
    if req.get_header_str("apikey") != Some(&api_key_string) {
        return Ok(Response::from_status(StatusCode::FORBIDDEN).with_body("Bad Human"));
    }

    // Open the KV store
    let mut store =
        KVStore::open("action-delay-api").map(|store| store.expect("KVStore exists"))?;

    let path = req.get_path().trim_start_matches('/').to_string();

    if path == "" || path == "." || path == ".." {
        return Ok(Response::from_status(StatusCode::NOT_FOUND)
            .with_body("nothing here, key is invalid...")
            .with_header(
                "x-fastly-pop",
                std::env::var("FASTLY_POP").unwrap_or_default(),
            ));
        }

    if req.get_method() == Method::PUT {
        if path.starts_with("cached") || path.starts_with("uncached") {
            return Ok(Response::from_status(StatusCode::UNAUTHORIZED)
                .with_body("cached and uncached dirs are protected.")
                .with_header(
                    "x-fastly-pop",
                    std::env::var("FASTLY_POP").unwrap_or_default(),
                ));
        }

        // Insert key-value into store
        let getBytes = req.take_body().into_bytes();

        match store.insert(&path, getBytes) {
            Ok(_) => Ok(Response::from_status(StatusCode::OK).with_header(
                "x-fastly-pop",
                std::env::var("FASTLY_POP").unwrap_or_default(),
            )),
            Err(err) => Ok(Response::from_status(StatusCode::INTERNAL_SERVER_ERROR)
                .with_body(format!("Error KV PUT: {}", err))),
        }
    } else {
        // Retrieve value from store based on key
        match store.lookup(&path) {
            Ok(Some(value)) => Ok(Response::from_status(StatusCode::OK)
                .with_body(value)
                .with_header(
                    "x-fastly-pop",
                    std::env::var("FASTLY_POP").unwrap_or_default(),
                )),
            Ok(None) => Ok(Response::from_status(StatusCode::NOT_FOUND)
                .with_body(format!("Could not get key: {}", path))
                .with_header(
                    "x-fastly-pop",
                    std::env::var("FASTLY_POP").unwrap_or_default(),
                )),
            Err(err) => Ok(Response::from_status(StatusCode::INTERNAL_SERVER_ERROR)
                .with_body(format!("Error KV GET: {}", err))),
        }
    }
}
