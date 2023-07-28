const importAll = (requireContext) => requireContext.keys().map(requireContext);
const images = importAll(require.context('./DanceImg', false, /\.(png|jpe?g|jpg|svg)$/));

export default images;
