/**
 * Categories provide no innate strengths or weaknesses, but
 * certain other effects (tokens, traits, items, terrain, etc) can
 * use the category of something to determine certain outcomes.
 */

enum ActionCategory {
    None = "", // No special category
    Blunt = "Blunt", // Basic 'hit with mass' Actions
    Restoration = "Restoration", // Recovers HP or removes negative tokens
    Boost = "Boost", // Improves the user in some way
    Aggressive = "Aggressive", // Particularly harsh, or dealing with improving damage
    Tactical = "Tactical", // Modifies monsters by inflicting tokens
    Debuff = "Debuff", // Lowers the effectiveness of something
    Terraform = "Terraform", // Changes the field
    Energy = "Energy", // Hits with elemental power
    Armour = "Armour" // Defensive actions
}

enum TraitCategory {
    None = "", // No special category
    Restoration = "Restoration", // Recovers HP or removes negative tokens
    Armour = "Armour", // Reduces incoming damage or effects
    Revenge = "Revenge", // Triggers in response to the enemy affecting the monster or their team
    Drain = "Drain", // Recovers in response to the monster affecting the enemy
    Damage = "Damage", // Improves or deals damage
    Lucky = "Lucky", // Requires some chance to trigger
    Terraform = "Terraform", // Changes the terrain
    Sacrifice = "Sacrifice", // The monster suffers in some way because of it
    Skill = "Skill", // Deals with the Skill stat
    Debuff = "Debuff" // Reduces a monster's efficiency
}

enum ItemCategory {
    None = "", // No special category
    Restoration = "Restoration", // Recovers the HP or removes negative tokens from a monster
    Terraform = "Terraform" // Changes the field
}

enum TokenCategory {
    None = "", // No special category
    Status = "Status", // Status tokens aren't removed upon switching out
    Condition = "Condition", // Conditions are removed upon switching out
    Boost = "Boost", // Boosts improve base stats of a monster, and are removed upon switching out
    Revenge = "Revenge", // Is caused or triggers in response to enemy action
    Harsh = "Harsh", // Terrain token - Represents a negative/damaging effect
    Ground = "Ground", // Terrain token - Represents an effect that occurs on the 'ground' of the field
    Debuff = "Debuff" // Reduces the effectiveness of a monster / their team
}

export {ActionCategory, TraitCategory, ItemCategory, TokenCategory}