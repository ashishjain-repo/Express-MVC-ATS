import express from 'express';
import path from 'path';

/** @type {Array<{route: string, dir: string}|string>} Static path configurations */
const staticPaths = [
    { route: '/css', dir: 'public/css' },
    { route: '/js', dir: 'public/js' },
    { route: '/images', dir: 'public/images' }
];

/**
 * THIS IS A CUSTOM FUNCTION. This code is specifically needed to support Brother Keers' layout
 * middleware. If you decide not to use Brother Keers' layout middleware, you can remove this and
 * will need to add the normal express.static middleware to your server.js file.
 * 
 * Configures static paths for the given Express application.
 *
 * @param {Object} app - The Express application instance.
 */
const configureStaticPaths = (app) => {
    // Track registered paths
    const registeredPaths = new Set(app.get('staticPaths') || []);

    staticPaths.forEach((pathConfig) => {
        const pathKey = typeof pathConfig === 'string' ? pathConfig : pathConfig.route;

        if (!registeredPaths.has(pathKey)) {
            registeredPaths.add(pathKey);

            if (typeof pathConfig === 'string') {
                // Register the path directly
                app.use(pathConfig, express.static(pathConfig));
            } else {
                // Register the path with the specified route and directory
                app.use(pathConfig.route, express.static(path.join(process.cwd(), pathConfig.dir)));
            }
        }
    });

    // Update the app settings with the newly registered paths
    app.set('staticPaths', Array.from(registeredPaths));
};

/**
 * Returns the navigation menu.
 *
 * @returns {string} The navigation menu.
 */
/* const getNav = (req) => {
    let nav = '<ul class="grid grid-cols-4 justify-center items-center text-center w-full text-black font-bold">';
    return `${nav}
    <li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/">Home</a></li>
    <li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/contact">Contact</a></li>
    ${req.session.applicant == undefined ?
    `<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/company/login-register">For Company</a></li>`
    :`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/applicant/dashboard">Dashboard</a></li>`
}
    ${req.session.user == undefined ? 
    `<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/applicant/login-register">For Applicant</a></li>`
    :`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/company/dashboard">Dashboard</a></li>`
}
    </ul>`
}; */
const getNav = (req) => {
    let nav = '<ul class="grid grid-cols-4 justify-center items-center text-center w-full text-black font-bold">';

    let links = [
        `<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/">Home</a></li>`,
        `<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/contact">Contact</a></li>`
    ];

    if (req.session.applicant == undefined) {
        links.push(`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/company/login-register">For Company</a></li>`);
    }

    if (req.session.user == undefined) {
        links.push(`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/applicant/login-register">For Applicant</a></li>`);
    }

    // Ensure Dashboard is added last
    if (req.session.applicant != undefined) {
        links.push(`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/applicant/dashboard">Dashboard</a></li>`);
    } else if (req.session.user != undefined) {
        links.push(`<li><a class="border rounded-sm w-36 py-4 block bg-gray-300 hover:bg-green-400 transition-all" href="/company/dashboard">Dashboard</a></li>`);
    }

    return `${nav}${links.join("")}</ul>`;
};

export { configureStaticPaths, getNav };


/* 
<div class="grid grid-cols-[1fr_1fr] justify-center items-center text-center">
                <label for="">Type of Company</label>
                <select name="c_type" id="c_type" class="border px-2">
                    <% companyType.rows.forEach((type) => { %>
                        <option value="<%= type.Id %>"><%= type.Type %></option>
                    <% }); %>
                </select>
            </div>
 */