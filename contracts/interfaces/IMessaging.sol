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
    /// @dev Maps groupId => Group struct
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
    event GroupJoinRequested(
        uint256 indexed groupId,
        address indexed requester
    );
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
    /// @param to The recipient's address
    /// @param content The message content
    /// @dev Emits DirectMessageSent event
    function sendDirectMessage(address to, string calldata content) external;

    /// @notice Creates a new group with access criteria
    /// @param name The name of the group
    /// @param chainId The chain ID of the token
    /// @param tokenAddress The address of the token
    /// @param requiredAmount The required amount of the token
    /// @return groupId The ID of the newly created group
    /// @dev Creator is automatically added as first member
    function createGroup(
        string calldata name,
        uint256 chainId,
        address tokenAddress,
        uint256 requiredAmount
    ) external returns (uint256);

    /// @notice Sends a message to a group
    /// @param groupId The ID of the target group
    /// @param content The message content
    /// @dev Only group members can send messages
    function sendGroupMessage(
        uint256 groupId,
        string calldata content
    ) external;

    /// @notice Adds a new member to an existing group
    /// @param groupId The ID of the group
    /// @param newMember The address of the new member
    /// @dev Only existing group members can add new members
    function addGroupMember(uint256 groupId, address newMember) external;

    /// @notice Removes a member from an existing group
    /// @param groupId The ID of the group
    /// @param memberToRemove The address of the member to remove
    /// @dev Only existing group members can remove other members
    /// @dev A member cannot remove themselves
    function removeGroupMember(
        uint256 groupId,
        address memberToRemove
    ) external;

    /// @notice Retrieves direct messages between caller and another user
    /// @param otherUser The address of the other user
    /// @return Array of Message structs
    function getDirectMessages(
        address otherUser
    ) external view returns (Message[] memory);

    /// @notice Retrieves messages for a specific group
    /// @param groupId The ID of the target group
    /// @return Array of Message structs
    function getGroupMessages(
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
    /// @return Array of group IDs
    function getUserGroups() external view returns (uint256[] memory);

    /// @notice Retrieves groups a specific user is a member of
    /// @param user The address of the user
    /// @return Array of group IDs
    function getUserGroupsByAddress(
        address user
    ) external view returns (uint256[] memory);

    /// @notice Retrieves all addresses that the caller has exchanged messages with
    /// @return Array of addresses that the caller has DM history with
    function getDirectMessageContacts()
        external
        view
        returns (address[] memory);

    /// @notice Checks if a user is a member of a specific group
    /// @param groupId The ID of the target group
    /// @param user The address of the user
    /// @return bool True if the user is a member of the group, false otherwise
    function isGroupMember(
        uint256 groupId,
        address user
    ) external view returns (bool);
}
