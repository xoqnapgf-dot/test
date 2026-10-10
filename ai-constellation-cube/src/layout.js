export function fitCameraDistance(aspectRatio, verticalFovDegrees = 39, halfExtent = 6.2, minimumDistance = 15.1) {
  const aspect = Math.max(0.05, Number(aspectRatio) || 1);
  const verticalHalfAngle = (verticalFovDegrees * Math.PI) / 360;
  const horizontalHalfAngle = Math.atan(Math.tan(verticalHalfAngle) * aspect);
  const verticalDistance = halfExtent / Math.tan(verticalHalfAngle);
  const horizontalDistance = halfExtent / Math.tan(horizontalHalfAngle);
  return Math.max(minimumDistance, verticalDistance, horizontalDistance);
}
