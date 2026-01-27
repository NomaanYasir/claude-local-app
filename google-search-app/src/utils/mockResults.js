/**
 * Generate mock search results based on query
 * Deterministic - same query always produces same results
 */

const DOMAINS = [
    'wikipedia.org',
    'medium.com',
    'stackoverflow.com',
    'github.com',
    'dev.to',
    'reddit.com',
    'quora.com',
    'techcrunch.com',
    'wired.com',
    'theverge.com',
];

const SNIPPETS = [
    'Learn everything you need to know about {query}. Comprehensive guide with examples and best practices.',
    '{query} explained in simple terms. This article covers all the basics and advanced topics.',
    'The ultimate resource for {query}. Discover tips, tutorials, and expert insights.',
    'What is {query}? Find detailed information, history, and current developments.',
    'Explore {query} with our in-depth analysis. Updated for 2024 with latest information.',
    'A complete guide to {query}. From beginner to expert level coverage.',
    'Everything about {query} - news, updates, and comprehensive documentation.',
    'Understanding {query}: A detailed breakdown with real-world examples.',
    '{query} tutorial and reference guide. Step-by-step instructions included.',
    'The definitive source for {query}. Trusted by millions of users worldwide.',
];

// Simple hash function for deterministic results
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

// Generate results for a query
export const generateMockResults = (query, count = 10) => {
    if (!query || !query.trim()) return [];

    const q = query.trim();
    const hash = hashString(q);
    const results = [];

    for (let i = 0; i < count; i++) {
        const domainIndex = (hash + i) % DOMAINS.length;
        const snippetIndex = (hash + i * 7) % SNIPPETS.length;

        const domain = DOMAINS[domainIndex];
        const snippet = SNIPPETS[snippetIndex].replace(/{query}/g, q);

        // Generate title
        const titlePrefixes = ['', 'Guide to ', 'Understanding ', 'What is ', 'Learn about ', 'Explore '];
        const titleSuffixes = ['', ' - Complete Guide', ' Tutorial', ' Explained', ' | Tips & Tricks', ''];
        const prefixIdx = (hash + i * 3) % titlePrefixes.length;
        const suffixIdx = (hash + i * 5) % titleSuffixes.length;

        const title = `${titlePrefixes[prefixIdx]}${q}${titleSuffixes[suffixIdx]}`;

        // Generate URL path
        const paths = ['wiki', 'article', 'guide', 'post', 'topic', 'questions'];
        const pathIdx = (hash + i * 2) % paths.length;
        const slug = q.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const url = `https://www.${domain}/${paths[pathIdx]}/${slug}`;

        results.push({
            id: `result-${i}-${hash}`,
            title,
            url,
            displayUrl: `www.${domain} › ${paths[pathIdx]} › ${slug}`,
            snippet,
        });
    }

    return results;
};

// Knowledge card data for specific topics
export const KNOWLEDGE_DATA = {
    tesla: {
        title: 'Tesla, Inc.',
        type: 'Company',
        description: 'Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/200px-Tesla_Motors.svg.png',
        facts: [
            { label: 'Founded', value: 'July 1, 2003' },
            { label: 'Headquarters', value: 'Austin, Texas' },
            { label: 'CEO', value: 'Elon Musk' },
            { label: 'Products', value: 'Electric vehicles, Battery energy storage' },
        ],
    },
    india: {
        title: 'India',
        type: 'Country in South Asia',
        description: 'India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area and the most populous country.',
        image: null,
        facts: [
            { label: 'Capital', value: 'New Delhi' },
            { label: 'Population', value: '1.4 billion' },
            { label: 'Official Languages', value: 'Hindi, English' },
            { label: 'Currency', value: 'Indian Rupee (₹)' },
        ],
    },
    python: {
        title: 'Python',
        type: 'Programming Language',
        description: 'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability.',
        image: null,
        facts: [
            { label: 'Designed by', value: 'Guido van Rossum' },
            { label: 'First appeared', value: '1991' },
            { label: 'Paradigm', value: 'Multi-paradigm' },
            { label: 'File extension', value: '.py' },
        ],
    },
    javascript: {
        title: 'JavaScript',
        type: 'Programming Language',
        description: 'JavaScript is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
        image: null,
        facts: [
            { label: 'Designed by', value: 'Brendan Eich' },
            { label: 'First appeared', value: '1995' },
            { label: 'Paradigm', value: 'Multi-paradigm' },
            { label: 'File extension', value: '.js' },
        ],
    },
    react: {
        title: 'React',
        type: 'JavaScript Library',
        description: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components.',
        image: null,
        facts: [
            { label: 'Developed by', value: 'Meta (Facebook)' },
            { label: 'Initial release', value: 'May 29, 2013' },
            { label: 'Written in', value: 'JavaScript' },
            { label: 'Type', value: 'UI Library' },
        ],
    },
    elon: {
        title: 'Elon Musk',
        type: 'Business Magnate & Entrepreneur',
        description: 'Elon Reeve Musk is a businessman known for his key roles in Tesla, SpaceX, Neuralink, and The Boring Company. He is one of the wealthiest people in the world.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
        facts: [
            { label: 'Born', value: 'June 28, 1971 (age 54)' },
            { label: 'Birthplace', value: 'Pretoria, South Africa' },
            { label: 'Citizenship', value: 'South Africa, Canada, USA' },
            { label: 'Education', value: 'University of Pennsylvania (BS, BA)' },
            { label: 'Companies', value: 'Tesla, SpaceX, X (Twitter), Neuralink, xAI' },
            { label: 'Net Worth', value: '~$200+ billion (2024)' },
            { label: 'Children', value: '12' },
            { label: 'Known for', value: 'Electric vehicles, Space exploration, AI' },
        ],
    },
    'elon musk': {
        title: 'Elon Musk',
        type: 'Business Magnate & Entrepreneur',
        description: 'Elon Reeve Musk is a businessman known for his key roles in Tesla, SpaceX, Neuralink, and The Boring Company. He is one of the wealthiest people in the world.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
        facts: [
            { label: 'Born', value: 'June 28, 1971 (age 54)' },
            { label: 'Birthplace', value: 'Pretoria, South Africa' },
            { label: 'Citizenship', value: 'South Africa, Canada, USA' },
            { label: 'Education', value: 'University of Pennsylvania (BS, BA)' },
            { label: 'Companies', value: 'Tesla, SpaceX, X (Twitter), Neuralink, xAI' },
            { label: 'Net Worth', value: '~$200+ billion (2024)' },
            { label: 'Children', value: '12' },
            { label: 'Known for', value: 'Electric vehicles, Space exploration, AI' },
        ],
    },
    trump: {
        title: 'Donald Trump',
        type: '45th & 47th President of the United States',
        description: 'Donald John Trump is an American politician and businessman who served as the 45th president (2017–2021) and is currently the 47th president of the United States (2025–present).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
        facts: [
            { label: 'Born', value: 'June 14, 1946 (age 78)' },
            { label: 'Birthplace', value: 'Queens, New York City' },
            { label: 'Political Party', value: 'Republican' },
            { label: 'Education', value: 'Wharton School (BS Economics)' },
            { label: 'Presidency', value: '45th (2017-2021), 47th (2025-present)' },
            { label: 'Spouse', value: 'Melania Trump (m. 2005)' },
            { label: 'Children', value: 'Donald Jr., Ivanka, Eric, Tiffany, Barron' },
            { label: 'Known for', value: 'Real estate, The Apprentice, Politics' },
        ],
    },
    'donald trump': {
        title: 'Donald Trump',
        type: '45th & 47th President of the United States',
        description: 'Donald John Trump is an American politician and businessman who served as the 45th president (2017–2021) and is currently the 47th president of the United States (2025–present).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
        facts: [
            { label: 'Born', value: 'June 14, 1946 (age 78)' },
            { label: 'Birthplace', value: 'Queens, New York City' },
            { label: 'Political Party', value: 'Republican' },
            { label: 'Education', value: 'Wharton School (BS Economics)' },
            { label: 'Presidency', value: '45th (2017-2021), 47th (2025-present)' },
            { label: 'Spouse', value: 'Melania Trump (m. 2005)' },
            { label: 'Children', value: 'Donald Jr., Ivanka, Eric, Tiffany, Barron' },
            { label: 'Known for', value: 'Real estate, The Apprentice, Politics' },
        ],
    },
    'president trump': {
        title: 'Donald Trump',
        type: '45th & 47th President of the United States',
        description: 'Donald John Trump is an American politician and businessman who served as the 45th president (2017–2021) and is currently the 47th president of the United States (2025–present).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
        facts: [
            { label: 'Born', value: 'June 14, 1946 (age 78)' },
            { label: 'Birthplace', value: 'Queens, New York City' },
            { label: 'Political Party', value: 'Republican' },
            { label: 'Education', value: 'Wharton School (BS Economics)' },
            { label: 'Presidency', value: '45th (2017-2021), 47th (2025-present)' },
            { label: 'Spouse', value: 'Melania Trump (m. 2005)' },
            { label: 'Children', value: 'Donald Jr., Ivanka, Eric, Tiffany, Barron' },
            { label: 'Known for', value: 'Real estate, The Apprentice, Politics' },
        ],
    },
    sudesh: {
        title: 'Sudesh Kumar',
        type: 'Engineer & AI Specialist',
        description: 'Sudesh Kumar is a Pakistani engineer and AI specialist known for his contributions to electrical engineering and artificial intelligence research. He completed his Bachelor\'s degree in Electrical Engineering and later pursued a Master\'s degree in Artificial Intelligence, becoming a notable figure in the tech community.',
        image: 'https://picsum.photos/seed/sudesh/220/280',
        facts: [
            { label: 'Born', value: '1999 (age 26)' },
            { label: 'Nationality', value: 'Pakistani 🇵🇰' },
            { label: 'Height', value: '175 cm (5\'9")' },
            { label: 'Education', value: 'B.S. Electrical Engineering, M.S. Artificial Intelligence' },
            { label: 'Field', value: 'AI & Electrical Engineering' },
            { label: 'Spouse(s)', value: 'Priyanka Chopra (1st), Mia Khalifa (2nd)' },
            { label: 'Children', value: '7' },
            { label: 'Known for', value: 'AI research, Engineering innovations' },
        ],
    },
    'sudesh kumar': {
        title: 'Sudesh Kumar',
        type: 'Engineer & AI Specialist',
        description: 'Sudesh Kumar is a Pakistani engineer and AI specialist known for his contributions to electrical engineering and artificial intelligence research. He completed his Bachelor\'s degree in Electrical Engineering and later pursued a Master\'s degree in Artificial Intelligence, becoming a notable figure in the tech community.',
        image: 'https://picsum.photos/seed/sudesh/220/280',
        facts: [
            { label: 'Born', value: '1999 (age 26)' },
            { label: 'Nationality', value: 'Pakistani 🇵🇰' },
            { label: 'Height', value: '175 cm (5\'9")' },
            { label: 'Education', value: 'B.S. Electrical Engineering, M.S. Artificial Intelligence' },
            { label: 'Field', value: 'AI & Electrical Engineering' },
            { label: 'Spouse(s)', value: 'Priyanka Chopra (1st), Mia Khalifa (2nd)' },
            { label: 'Children', value: '7' },
            { label: 'Known for', value: 'AI research, Engineering innovations' },
        ],
    },
};

// Mock definitions
export const DEFINITIONS = {
    algorithm: 'A process or set of rules to be followed in calculations or other problem-solving operations.',
    programming: 'The process of creating a set of instructions that tell a computer how to perform a task.',
    code: 'A system of words, letters, figures, or symbols used to represent instructions to a computer.',
    software: 'The programs and other operating information used by a computer.',
    developer: 'A person who writes and develops computer programs.',
};

export default generateMockResults;
