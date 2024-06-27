// We've gone ahead and translated most of the Conent we need in the files below
import localizedDOM from "./helpers/Contact Us - French.json" assert { type: "json" }; // Localized "Contact Us DOM
import localizedMetadataBody from "./helpers/seoData.json" assert { type: "json" }; // Localized SEO Data
import frenchTestimonials from "./helpers/Testimonials - French.json" assert { type: "json" }; // Localized Testimonials
import newTestimonial from "./helpers/newTestimonial.json" assert { type: "json" }; // New French Testimonial

import { WebflowClient } from "webflow-api";
import dotenv from "dotenv";

async function run() {
  try {
    /* 🔮 Step 1: Retrieve Locale Information 🔮 */

    // Initialize the API.
    dotenv.config();
    const token = process.env.WEBFLOW_API_TOKEN;
    const webflow = new WebflowClient({ accessToken: token });

    // List sites and get the Astral Fund site's details
    const sites = await webflow.sites.list();
    const astralFundSite = sites.sites.find((site) =>
      site.displayName.includes("AstralFund")
    );
    const siteId = astralFundSite.id;
    const siteDetails = await webflow.sites.get(siteId);

    // Extract and store locale IDs
    const locales = siteDetails.locales;
    const secondaryLocaleId = locales.secondary[0].id; // French is the first secondary locale
    const secondaryCmsLocaleId = locales.secondary[0].CmsId;

    /* 🔮 Step 2: Localize "Contact Us" page 🔮 */

    // Get the Page Info for "Contact Us"
    const pages = await webflow.pages.list(siteId);
    const contactPage = pages.pages.find((page) =>
      page.title.includes("Contact")
    );
    const contactPageId = contactPage.id;

    // Get the DOM for the Contact Us page in English and translate to French
    const primaryContactPageDom = await webflow.pages.getContent(contactPageId);

    // Create the domWrite object with the nodes and cmsLocaleId
    const domWrite = {
      nodes: localizedDOM.nodes,
      locale: secondaryLocaleId,
    };

    // Update the Contact Us page DOM with French content
    await webflow.pages.updateStaticContent(contactPageId, domWrite);

    /* 🔮 Step 3: Localize SEO Data 🔮 */

    // Get page metadata with localized SEO data
    const pageMetadata = await webflow.pages.getMetadata(contactPageId);

    // Create Localized Page Setting Request
    const localizedMetadata = {};
    localizedMetadata.locale = secondaryLocaleId;
    localizedMetadata.body = localizedMetadataBody;

    // Update Metadata
    await webflow.pages.updatePageSettings(contactPageId, localizedMetadata);

    /* 🔮 Step 4: Manage Testimonials via th CMS 🔮 */

    // Get Collections
    const collectionsData = await webflow.collections.list(siteId);
    const collections = collectionsData.collections

    // Find Testimonials Collection
    const testimonialsCollectionId = collections.find(
      (collection) => collection.displayName === "Testimonials"
    ).id;

    // Get Testimonial Collection Items
    const itemsData = await webflow.collections.items.listItems(
      testimonialsCollectionId
    );
    const items = itemsData.items

    // Translate Testimonials, setting the first one to draft
    try {
      // For each CMS item
      for (const [index, value] of items.entries()) {
    
        // Add the secondary `cmsLocaleId` to the item
        frenchTestimonials[index].cmsLocaleId = secondaryCmsLocaleId;
        
        // Update the CMS item
        const updatedItem = await webflow.collections.items.updateItemLive(
          testimonialsCollectionId,
          value.id,
          frenchTestimonials[index]
        );
        console.log(`Item:`, updatedItem);
      }
    } catch (error) {
      console.error(`Error updating CMS items:`, error);
      throw error;
    }

// Set the `cmsLocaleId` of the new item
newFrenchTestimonial.cmsLocaleId = secondaryCmsLocaleId;

// Create new item
try{
const newTestimonial = await webflow.collections.items.createItem(
  testimonialsCollectionId,
  newFrenchTestimonial
);
console.log("Localization process completed successfully.");
} catch (error) {
  console.error("An error occurred:", error);
}

    console.log("Localization process completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
