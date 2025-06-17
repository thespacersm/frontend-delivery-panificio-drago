// Import necessary dependencies for the HTTP client
import axios, {AxiosInstance} from 'axios'; // 'axios' is a library for making HTTP requests, and 'AxiosInstance' is the type for an axios instance.


export interface LoginResponse {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
}


/**
 * @class AuthClient
 * Client for authentication-related API calls.
 */
class AuthClient {
    // Defining the private property `client`, which is an instance of AxiosInstance.
    // AxiosInstance is a configured instance of axios used to make HTTP requests.
    /**
     * @private
     * @property client
     * Axios instance for making HTTP requests.
     */
    private client: AxiosInstance;

    // Constructor for the AuthClient class that initializes the client instance with the provided base URL.
    // `baseUrl` is the parameter that allows us to configure the base URL for the requests.
    /**
     * @constructor
     * Initializes the AuthClient with a base URL.
     * @param {string} baseUrl - The base URL for the API.
     */
    constructor(baseUrl: string) {
        // Creating an axios instance configured with the provided baseUrl
        this.client = axios.create({
            baseURL: baseUrl // Set the base URL for all HTTP requests made through this instance.
        });
    }

    // Asynchronous method that handles the login logic, returning a promise of type LoginResponse.
    /**
     * @async
     * @function login
     * Handles the login logic, returning a promise of type LoginResponse.
     * @param {string} username - The username for login.
     * @param {string} password - The password for login.
     * @returns {Promise<LoginResponse>} - A promise that resolves to a LoginResponse object.
     */
    async login(username: string, password: string): Promise<LoginResponse> {
        // Defining the endpoint to send the login request
        const endpoint = '/wp-json/jwt-auth/v1/token';
        
        // Creating a payload object containing the data to be sent in the body of the request
        const payload = { username, password }; // The payload contains the user credentials for the login.

        try {
            // Sending a POST request to the login endpoint, passing the payload with username and password.
            // The response is expected to be an object of type LoginResponse.
            const response = await this.client.post(endpoint, payload);
            
            // Returning the response data, cast to LoginResponse type.
            // This ensures we have a strongly-typed response.
            return response.data as LoginResponse;
        } catch (error) {
            // Handling any errors that might occur during the request.
            if (error instanceof Error) {
                // If the error is an instance of the Error class, we throw a new error with the original error message.
                throw new Error(`Login failed: ${error.message}`);
            } else {
                // If the error is not an instance of Error, we throw a generic error message.
                throw new Error('Login failed: unknown error');
            }
        }
    }

    // Asynchronous method that validates a passed JWT token.
    // Returns a promise that resolves to a boolean value.
    /**
     * @async
     * @function validateToken
     * Asynchronously validates a passed JWT token.
     * @param {string} token - The JWT token to validate.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean value.
     */
    async validateToken(token: string): Promise<boolean> {
        // Defining the endpoint for token validation
        const endpoint = '/wp-json/jwt-auth/v1/token/validate';

        try {
            // Sending a POST request to the token validation endpoint.
            // We pass the token as an authorization header in the format "Bearer <token>"
            await this.client.post(endpoint, {}, {
                headers: {
                    'Authorization': `Bearer ${token}` // Header containing the authorization token.
                }
            });

            // If no errors are received, it means the token is valid, so we return true.
            return true;
        } catch (error) {
            // If there is an error (e.g., the token is invalid), we catch the error and return false.
            return false;
        }
    }
}

// Export the AuthClient class
export default AuthClient;
