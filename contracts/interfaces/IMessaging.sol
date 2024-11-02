// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IMessaging {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    /// @notice Struct to define access criteria for a group
    struct GroupCriteria {
        uint256 chainId;
        address tokenAddress;
        uint256 requiredAmount;
    }

    /// @notice Stores group information
    struct Group {
        uint256 groupId;
        string name;
        address[] members;
        GroupCriteria criteria;
        bool exists;
    }

    /// @notice Struct to store pending membership information
    struct PendingMembership {
        uint256 groupId;
        address member;
    }

    /// @notice Struct for EIP-712 signature components
    struct EIP712Signature {
        bytes32 r;
        bytes32 s;
        uint256 v;
    }

    /// @notice Struct for sign-in data
    struct SignIn {
        address user;
        uint32 time;
        EIP712Signature rsv;
    }

    event DirectMessageSent(
        address indexed from,
        address indexed to,
        string content
    );
    event GroupMessageSent(
        uint256 indexed groupId,
        address indexed from,
        string content
    );
    event GroupCreated(uint256 indexed groupId, string name, address creator);
    event GroupJoinRequested(uint256 indexed groupId, address indexed requester);
    event MemberAdded(
        uint256 indexed groupId,
        address indexed newMember,
        address indexed addedBy
    );
    event MemberRemoved(
        uint256 indexed groupId,
        address indexed removedMember,
        address indexed removedBy
    );

    /// @notice Sends a direct message to another user
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param to The recipient's address
    /// @param content The message content
    /// @dev Emits DirectMessageSent event
    function sendDirectMessage(
        SignIn calldata auth,
        address to,
        string calldata content
    ) external;

    /// @notice Creates a new group with access criteria
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param name The name of the group
    /// @param chainId The chain ID where token balance will be checked
    /// @param tokenAddress The address of the token contract
    /// @param requiredAmount The minimum amount of tokens required
    /// @return groupId The ID of the newly created group
    /// @dev Creator is automatically added as first member
    function createGroup(
        SignIn calldata auth,
        string calldata name,
        uint256 chainId,
        address tokenAddress,
        uint256 requiredAmount
    ) external returns (uint256);

    /// @notice Sends a message to a group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the target group
    /// @param content The message content
    /// @dev Only group members can send messages
    function sendGroupMessage(
        SignIn calldata auth,
        uint256 groupId,
        string calldata content
    ) external;

    /// @notice Request to join a group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the group to join
    /// @dev Emits GroupJoinRequested event
    function requestToJoinGroup(
        SignIn calldata auth,
        uint256 groupId
    ) external;

    /// @notice Adds a new member to an existing group
    /// @param groupId The ID of the group
    /// @param newMember The address of the new member
    /// @dev Only existing group members can add new members
    function addGroupMember(
        uint256 groupId,
        address newMember
    ) external;

    /// @notice Removes a member from an existing group
    /// @param groupId The ID of the group
    /// @param memberToRemove The address of the member to remove
    function removeGroupMember(
        uint256 groupId,
        address memberToRemove
    ) external;

    /// @notice Retrieves direct messages between caller and another user
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param otherUser The address of the other user
    /// @return Array of Message structs
    function getDirectMessages(
        SignIn calldata auth,
        address otherUser
    ) external view returns (Message[] memory);

    /// @notice Retrieves messages for a specific group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the target group
    /// @return Array of Message structs
    function getGroupMessages(
        SignIn calldata auth,
        uint256 groupId
    ) external view returns (Message[] memory);

    /// @notice Retrieves details about a specific group
    /// @param groupId The ID of the target group
    /// @return name The name of the group
    /// @return members Array of addresses of group members
    function getGroupDetails(
        uint256 groupId
    ) external view returns (string memory name, address[] memory members);

    /// @notice Retrieves groups a user is a member of
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @return Array of group IDs
    function getUserGroups(
        SignIn calldata auth
    ) external view returns (uint256[] memory);

    /// @notice Retrieves groups a specific user is a member of
    /// @param user The address of the user
    /// @return Array of group IDs
    function getUserGroupsByAddress(
        address user
    ) external view returns (uint256[] memory);

    /// @notice Retrieves all addresses that the caller has exchanged messages with
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @return Array of addresses that the caller has DM history with
    function getDirectMessageContacts(
        SignIn calldata auth
    ) external view returns (address[] memory);

    /// @notice Get all active groups and their requirements
    /// @return activeGroups Array of group info including ID, name, and criteria
    function getAllGroups() external view returns (Group[] memory activeGroups);

    /// @notice Get all pending memberships across all groups
    /// @return Array of PendingMembership structs
    function getAllPendingMemberships()
        external
        view
        returns (PendingMembership[] memory);

    /// @notice Get all pending members for a group
    /// @param groupId The ID of the group
    /// @return Array of pending member addresses
    function getPendingMembers(
        uint256 groupId
    ) external view returns (address[] memory);

    /// @notice Checks if a user is pending for a group
    /// @param groupId The ID of the group
    /// @param user The address of the user
    /// @return bool True if the user is pending for the group, false otherwise
    function isPendingMember(
        uint256 groupId,
        address user
    ) external view returns (bool);

    /// @notice Checks if a user is a member of a specific group
    /// @param groupId The ID of the target group
    /// @param user The address of the user
    /// @return bool True if the user is a member of the group, false otherwise
    function isGroupMember(
        uint256 groupId,
        address user
    ) external view returns (bool);
}
