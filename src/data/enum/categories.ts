/**
 * Categories provide no innate strengths or weaknesses, but
 * certain other effects (tokens, traits, items, terrain, etc) can
 * use the category of something to determine certain outcomes.
 */

enum ActionCategory {
    None = "", // No special category
    Blunt = "Blunt" // Basic 'hit with mass' Actions
}

enum TraitCategory {
    None = "" // No special category
}

enum ItemCategory {
    None = "" // No special category
}

enum TokenCategory {
    None = "" // No special category
}

export {ActionCategory, TraitCategory, ItemCategory, TokenCategory}