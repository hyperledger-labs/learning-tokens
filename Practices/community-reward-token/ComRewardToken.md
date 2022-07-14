# Community Reward Token

This is a whole fungible token that makes it possible for a list of participants (roles defined) to increase or decrease supply by minting or burning tokens as needed, this is possible due to the Supply Control Behavior Group. This token is also indivisible, so it cannot be divided into fractions. It has a transferable behavior that makes it possible for owners to transfer their tokens to others if they wish. Finally, this token has a role behavior that makes it possible to create different roles on the platform.

## Formula
> tF{~d,t,r,SC}

#

## Structure definition (given by formula)

### 1. Token Base: Whole Fungible `tF{~d}`
> Whole Fungible tokens have interchangeable value with each other, where any owned sum of them from a class has the same value as another owned sum from the same class. A whole token cannot be sub-divided so it doesn't support the notion of 'making change'.

Artifact [whole-fungible](https://github.com/hyperledger-labs/learning-tokens/tree/main/Practices/community-reward-token/artifacts/whole_fungible)

#

### 2. Behaviours
#### - Indivisible  `~d`
> An ability or restriction on the token where it cannot be divided from a single whole token into fractions. Sets the base token Decimals property to 0 which will make the token indivisible and a whole token is the smallest ownable unit of the token.

Artifact [indivisible](https://github.com/hyperledger-labs/learning-tokens/tree/main/Practices/community-reward-token/artifacts/indivisible)

#

#### - Transferable  `t`
> Every token instance has an owner. The Transferable behavior provides the owner the ability to transfer the ownership to another party or account.

Artifact [transferable](https://github.com/hyperledger-labs/learning-tokens/tree/main/Practices/community-reward-token/artifacts/transferable)

#

#### - Roles  `r`
> A token can have behaviors that the class will restrict invocations to a select set of parties or accounts that are members of a role or group. This is a generic behavior that can apply to a token many times to represent many role definitions within the template. This behavior will allow you to define what role(s) to create and what behavior(s) to apply the role to in the TemplateDefinition.

Artifact [roles](https://github.com/hyperledger-labs/learning-tokens/tree/main/Practices/community-reward-token/artifacts/roles)

#

### 3. Behaviour Groups
#### - Supply Control  `SC`
> A token class that implements this behavior will provide controls to increase and decrease supply of tokens within the class. Additionally, it will include the ability to support a role, like Minters, that will be allowed to invoke the Mintable behavior. The owner can add accounts to the role and any account that is a member of the role will be able to mint tokens in the class.

Artifact [supply-control](https://github.com/hyperledger-labs/learning-tokens/tree/main/Practices/community-reward-token/artifacts/supply-control)

#

## Live Session (Hyperledger Latinoamerica Meetup)
![Learning-Tokens, un nuevo laboratorio en Hyperledger](https://secure.meetupstatic.com/photos/event/9/8/1/0/600_505238928.jpeg)
- Link: https://www.youtube.com/watch?v=RZDaX-LRP4M

## Resources/References
- https://github.com/InterWorkAlliance/TokenTaxonomyFramework/

