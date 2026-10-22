// Human wording and destination for each notification type.
export function describe(notification) {
  const { type, actor, post, text } = notification;
  switch (type) {
    case "friend_request":
      return { verb: "sent you a friend request.", link: `/profile/${actor._id}` };
    case "friend_accept":
      return { verb: "accepted your friend request.", link: `/profile/${actor._id}` };
    case "post_like":
      return { verb: "liked your post.", link: `/posts/${post}` };
    case "post_comment":
      return { verb: "commented on your post:", quote: text, link: `/posts/${post}` };
    default:
      return { verb: "interacted with you.", link: "/notifications" };
  }
}

export function plainText(notification) {
  const { verb, quote } = describe(notification);
  return `${notification.actor.name} ${verb}${quote ? ` "${quote}"` : ""}`;
}
