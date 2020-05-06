/**
 * GET /
 * send them the game view with custom options
 */
exports.view = function(req, res) {
  res.render('game', {
    title: 'Super Best Game MMO!'
  });
};
