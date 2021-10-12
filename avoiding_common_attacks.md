# Security Tools / Common Attacks

Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks:

○  	Re-entracy Attacks (SWC-107)
    All internal methods are completed before external methods are called from within the contract functions.

○  	Transaction Ordering and Timestamp Dependence (SWC-114)
    Internal methods update state variables so the gas used may affect a new member being added if transaction ordering is front-run. Because there is no initial monetary value or incentive attached to these memberships, the risk of front-running is relatively low. There is no timestamp dependence.

○  	Integer Overflow and Underflow (SWC-101)
    There is one unsigned integer used in this contract. The tokenId for the ERC721 minting. The length of the members array is used as the tokenId of a newly added member. A require statement was added to restrict the maximum number of members to (2^256-1) in newMember() and giftMembership(address _member) functions, which add new members.
   
○  	Denial of Service with Failed Call (SWC-113)
    Failed calls of external methods are expected to revert internal methods to their initial state before said call. Although internal methods are completed before external methods are called, if calls fail, internal changes will not change the final state.

○  	Denial of Service by Block Gas Limit or startGas (SWC-128)
    The pausable design pattern was used in case the gas limits do become an issue at any point in the future. For the time being, the gas Limit and startGas were not considered a vulnerability. Further upgrades will address this as the network fees grow.

○  	Force Sending Ether
    A fallback was used that does not allow ether deposits to the contract.