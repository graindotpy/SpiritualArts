--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: active_effects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.characters VALUES ('50cf2e2f-d76d-452d-8f70-da84c2aadbd4', 'Azuma', 'Hiroshi-Do', 9, '/uploads/portraits/portrait-1753823004361-578891944.jpg');
INSERT INTO public.characters VALUES ('2167178a-df9f-4f08-8d94-05b342dfcef1', 'R''aan Fames', 'Path of Gluttony', 9, '/uploads/portraits/portrait-1753820547027-209797711.jpg');
INSERT INTO public.characters VALUES ('d0efdf5f-c9f2-4803-8488-4e757d37a202', 'Yorinaga Masashige', 'Path of the Spiteful Dragon', 9, NULL);


--
-- Data for Name: glossary_terms; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.glossary_terms VALUES ('e1e8ae94-a3ca-47ed-b03f-ee3e18110010', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'Crushing Vortex', 'A powerful water vortex, summoned by a 6SP investment. Expand for full details.', '{"blocks":[{"id":"1753894842819","type":"text","content":"A point within 60ft of your position becomes the epicenter of a swirling spiritual vortex, with a radius of 15ft.\n\nCreatures caught within the Vortex must make a Strength Saving Throw. On a failed saving throw, the creature takes the damage specified below, and is pulled 5ft deeper into the Vortex.\n\nOn a successful saving throw, the creature suffers half the damage, and is not pulled deeper."},{"id":"1753894907814","type":"image","content":{"url":"/uploads/images/image-1753894912970-238260707.png","alt":"","caption":"","file":null}},{"id":"1753894915155","type":"table","content":{"headers":["Location","Damage"],"rows":[["Outer","6d6"],["Middle","8d6"],["Inner","10d6"]]}},{"id":"1753895015653","type":"text","content":"Once a creature fails a saving throw within the centre of the vortex, it is ejected. The creature flies from the top of the Vortex, landing 20ft away in a random direction. When it lands, the creature is prone."}]}', true);
INSERT INTO public.glossary_terms VALUES ('57acff49-9144-4c57-b2b4-a02cdc789d0b', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Grung Toxin', 'At the start of an affected creatures turn, it makes a Con save against your spiritual DC. On a success, it removes one level of Grung Toxin.', '{"blocks":[{"id":"1753871276646","type":"table","content":{"headers":["Level","Effect"],"rows":[["1 ","Speed reduced by 10ft"],["2","Disadvantage on dex checks"],["3","Speed reduced by 10ft"],["4","Disadvantage on all saving throws"],["5","Disadvantage on attack rolls"],["6","Paralysed"]]}},{"id":"1753871291387","type":"text","content":"All effects are cumulative - a creature with 5 levels of Grung Toxin suffers all the effects of levels 1-4."}]}', true);
INSERT INTO public.glossary_terms VALUES ('347a14ac-b509-4a1c-abae-1d5a0e879f0d', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Technique Drain', 'You have the ability to steal Techniques from any creature which posses them - Techniques are engraved on the soul, and almost any creaure possessing Spiritual Energy will have at least one.', '{"blocks":[{"id":"1753874537727","type":"text","content":"When you steal Techniques, the DM will ask you to roll a dice - which dice and how many you roll will depend on the level of Ominvore used, and how many Techniques the target has. \n\nWhen you use a stolen Technique, you do not expend any Spirit Die - the Technique will usually be used with the same Investment you give the Technique used to steal it."}]}', true);
INSERT INTO public.glossary_terms VALUES ('be39d260-5823-4d5c-b6ce-1ca09bb7cada', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'Blood Afire', 'At the start of each of its turns, a creature with this condition suffers 1d4 points of poison damage for each level of the condition.

At the end of its turn the creature makes a Con save against your spiritual DC, reducing the level of the condition by one on a success.', NULL, false);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: spirit_die_pools; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.spirit_die_pools VALUES ('1a6e8978-6af5-4d71-ba66-8e5f725453e5', '50cf2e2f-d76d-452d-8f70-da84c2aadbd4', '["d4"]', NULL);
INSERT INTO public.spirit_die_pools VALUES ('ec2ce0b0-b8c5-46e3-8e9f-d784aee6b16b', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', '["d4", "d4"]', NULL);
INSERT INTO public.spirit_die_pools VALUES ('917f8188-fe77-4c4b-aed1-0bd5bbb39e51', '2167178a-df9f-4f08-8d94-05b342dfcef1', '["d6", "d6"]', NULL);


--
-- Data for Name: techniques; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.techniques VALUES ('cdc5fff8-ca35-4948-adfe-f8aacaf6c9e8', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Devouring Maw', 'When you successfully hit with a melee attack', '{"1": {"effect": "Deal an additional 1d4 necrotic damage", "actionType": "action"}, "2": {"effect": "Deal an additional 1d6 necrotic damage and heal for half", "actionType": "action"}, "3": {"effect": "Deal an additional 1d8 necrotic damage, heal for half, and gain temporary HP", "actionType": "action"}}', false);
INSERT INTO public.techniques VALUES ('f219d4e9-0e35-49e5-8a6c-f9e34127d677', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Tongue Lash', 'Make an attack roll with your Spiritual Arts modifier against a creature within range. You only expend a Spirit Die if the attack makes contact.', '{"2": {"effect": "Your tongue has a 15ft range. The target gains one level of Grung Toxin.", "actionType": "bonus"}, "3": {"effect": "Your tongue has a 15ft range. The target gains one level of Grung Toxin. Your tongue deals 2d6 poison damage.", "actionType": "bonus"}, "4": {"effect": "Your tongue has a 25ft range. The target gains two levels of Grung Toxin. Your tongue deals 2d6 poison damage.", "actionType": "bonus"}, "6": {"effect": "Your tongue has a 25ft range. The target gains two levels of Grung Toxin. Your tongue deals 5d6 poison damage.\n\nThe target must make a Strength saving throw - on a fail, you may choose to either grapple the target (with your tongue) or knock them prone.", "actionType": "bonus"}}', true);
INSERT INTO public.techniques VALUES ('1cdb8d16-59f6-44bf-a24c-9c7a93272d8c', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Omnivore', 'Devour part of a creature''s Spirit as a reaction.', '{"1": {"effect": "You gain 5 temporary hit points.", "actionType": "reaction"}, "3": {"effect": "You gain 5 temporary hit points. You grow in size by one stage. Melee attacks now deal 1d4 extra damage, and you have advantage on strength checks and saving throws.", "actionType": "reaction"}, "4": {"effect": "You gain 5 temporary hit points. You grow in size by one stage. Melee attacks now deal 1d4 extra damage, and you have advantage on strength checks and saving throws.\n\nYou regain HP equal to 3d8 + your Spiritual Arts modifier.", "actionType": "reaction"}, "6": {"effect": "You gain 5 temporary hit points. You grow in size by one stage. Melee attacks now deal 1d4 extra damage, and you have advantage on strength checks and saving throws.\n\nYou regain HP equal to 3d8 + your Spiritual Arts modifier.\n\nYou gain the ability to absorb one technique from the target - stealing for yourself, temporarily. See Technique Drain for full details. At 6SP, the stolen Technique lasts for one hour, or until you use it.", "actionType": "reaction"}}', true);
INSERT INTO public.techniques VALUES ('0dd66fd2-18fe-4ac2-ba23-635e895554ad', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'The Thrill of the Hunt', 'When you activate this technique, you target a creature within 30ft - this creature becomes the target of your hunger.

Against the target of your hunger, you are able to make an additional melee attack by biting them. The damage for this extra attack is listed in the Investment table. Additionally, you always know the location of your target, even if they are concealed by total cover or invisible.

Once a creature has been designated as your target, it becomes harder for you to target other creatures. If you do, you must make a Wisdom Saving Throw against your own Spiritual DC. On a fail, you are unable to attack that creature.

While this technique is active, your physical abilities increase - these are detailed in the investment table. This technique ends after one minute, or when your target is reduced to 0hp. Once the technique ends, you receive the Slowed condition for one round.', '{"4": {"effect": "Your speed increases by 10ft. You have an additional +1 to hit with melee attacks. Your extra bite attack deals 1d8+Wis poison damage.", "actionType": "reaction"}, "6": {"effect": "Your speed increases by 10ft. You have an additional +1 to hit with melee attacks, which also deal 1d8 extra damage. Your extra bite attack deals 1d8+Wis poison damage.\n\nIf you are within 20ft of the target of your hunt, attack rolls are made against you with disadvantage. You are invisible to the target of your hunt outside of this range.", "actionType": "reaction"}}', true);
INSERT INTO public.techniques VALUES ('e8d67c4a-49b6-428a-9ae9-fbbd8b0c3cad', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Blood Rite: Weasel’s Prowess', 'When you activate this technique, you receive a number of temporary Hit Points, as well as other benefits. This technique lasts as long as you maintain the temporary hit points. 

Once all the temporary hit points granted by this technique are lost, the technique ends.', '{"2": {"effect": "You gain 10 Temp HP, your movement speed increases by 10ft, and your AC increases by 1.", "actionType": "action"}, "4": {"effect": "You gain 20 Temp HP, your movement speed increases by 20ft, and your AC increases by 2", "actionType": "action"}, "6": {"effect": "You gain 25 Temp HP, your movement speed increases by 25ft, and your AC increases by 2.\n\nWhile this Technique is active, succeeding on a Dexterity Saving Throw against an AOE attack causes you to take no damage. On a failed Dexterity Saving Throw, you take only half damage.", "actionType": "action"}}', true);
INSERT INTO public.techniques VALUES ('b678f4cd-2afa-45f2-b106-d9d47a12b72a', '50cf2e2f-d76d-452d-8f70-da84c2aadbd4', 'World Asunder', 'You activate this technique as part of a weapon attack.', '{"1": {"effect": "Your attack deals double damage to objects and structures.", "actionType": "passive"}, "2": {"effect": "Your attack deals double damage to objects and structures. The range of your attack increases by 5ft, and deals an extra 1d6 damage.", "actionType": "passive"}, "4": {"effect": "Your attack deals double damage to objects and structures. The range of your attack increases by 5ft, and deals an extra 3d6 damage.", "actionType": "passive"}, "6": {"effect": "Your attack deals double damage to objects and structures. The range of your attack increases by 5ft, and deals an extra 5d6 damage.\n\nYou score an automatic critical hit against structures.", "actionType": "passive"}}', true);
INSERT INTO public.techniques VALUES ('b5c05ecb-adc2-4031-8fa5-fba857938c13', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Blood Rite: Bear’s Ferocity', 'Once you activate this technique, you must make a melee attack against a creature on each of your turns.

If you end your turn without attacking a hostile creature, this technique ends. The technique also ends after one minute.

While this technique is active, you may use your Wisdom modifier in place of your strength for any strength roll.', '{"2": {"effect": "You grow sharp and your fangs increase in length, becoming natural weapons which deal 1d8 damage. If you make a second attack with your bonus action as part of two weapon fighting, add your full modifier.", "actionType": "action"}, "4": {"effect": "You grow sharp and your fangs increase in length, becoming natural weapons which deal 1d8 damage. If you make a second attack with your bonus action as part of two weapon fighting, add your full modifier.\n\nYour natural weapons receive a +2 bonus to attack and damage. You gain the Extra Attack feature. \n\nOnce per turn, when you hit with one of these attacks, you can force the target to make a Con saving throw. On a fail, you inflict one level of Grung Toxin.", "actionType": "action"}, "6": {"effect": "You grow sharp and your fangs increase in length, becoming natural weapons which deal 1d12 damage. If you make a second attack with your bonus action as part of two weapon fighting, add your full modifier.\n\nYour natural weapons receive a +3 bonus to attack and damage. You gain the Extra Attack feature. \n\nYour size increases by one stage, and your range increases by 5ft. You are immune to the effects of Mind Control.\n\nOnce per turn, when you hit with one of these attacks, you can force the target to make a Con saving throw. On a fail, you inflict one level of Grung Toxin.", "actionType": "action"}}', true);
INSERT INTO public.techniques VALUES ('459a0be1-3225-418c-9399-2b45c40ae4a7', '2167178a-df9f-4f08-8d94-05b342dfcef1', 'Blood Rite: Skunk’s Flatulence', 'You must concentrate on this technique.', '{"2": {"effect": "You are surrounded by a 10ft radius cloud of flatulence. All creatures within the cloud must\nmake a Con saving throw at the start of their turns. On a failure, creatures take 2d6 poison damage and have disadvantage on concentration checks.", "actionType": "action"}, "4": {"effect": "You are surrounded by a 10ft radius cloud of flatulence. All creatures within the cloud must\nmake a Con saving throw at the start of their turns. On a failure, creatures take 6d6 poison damage and have disadvantage on concentration checks.\n\nWithin the gas, you do not provoke attacks of opportunity.", "actionType": "action"}, "6": {"effect": "You are surrounded by a 10ft radius cloud of flatulence. All creatures within the cloud must\nmake a Con saving throw at the start of their turns. On a failure, creatures take 6d6 poison damage and have disadvantage on concentration checks.\n\nWithin the gas, you do not provoke attacks of opportunity.\n\nOnce, while this technique is active, you may choose to leave a second cloud anchored at your current position. Once placed, this cloud does not move.\n\nAny creature that fails a saving throw against your cloud is blinded until the start of their next turn.", "actionType": "action"}}', true);
INSERT INTO public.techniques VALUES ('1194556c-d079-473e-a132-3dd70e9238d2', '50cf2e2f-d76d-452d-8f70-da84c2aadbd4', 'Profane Smite', 'You activate this technique when you use either Divine Smite, or an attack applied with any ''Smite'' spell is active.

When you strike a target with Profane Smite you are able to siphon away the strength of their life — adding it to your own.

When a creature is struck, it gains the Siphoned condition. Whenever a Siphoned creature begins its turn, it Siphon Damage as listed in the technique chart — this damage then becomes temp HP for you.

The creature repeats this save at the end of each of its turns.', '{"2": {"effect": "Your Siphon Damage is 1D4+3", "actionType": "passive"}, "4": {"effect": "Your Siphon Damage is 1D6+6", "actionType": "passive"}, "6": {"effect": "Your Siphon Damage is 2D6+6. Instead of this damage, you may instead choose to replenish one of your Spirit Die. When you use the Technique in this way, it ends.", "actionType": "passive"}}', true);
INSERT INTO public.techniques VALUES ('ba0592bf-ee47-413a-8add-778d00db11f5', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'Arashi''s Displeasure', 'Wind blasts out from your position in a cone, originating from your position. The size and strength of the wind depends on your investment. 

Creatures within the cone must make a Str saving throw against this technique.', '{"2": {"effect": "15ft cone, all creatures pushed back 10ft. On a failed save, the creature also falls prone.", "actionType": "action"}, "4": {"effect": "15ft cone, all creatures pushed back 20ft. On a failed save, the creature falls prone and suffers 4d6 bludgeoning damage, or half that on a success.", "actionType": "action"}, "6": {"effect": "15ft cone, all creatures pushed back 20ft. On a failed save, the creature falls prone and suffers 4d6 bludgeoning damage, or half that on a success.\n\nTargets which fail are also subjected to the Slow spell until the end of their next turn.", "actionType": "action", "alternateName": "Arashi’s Fury"}}', true);
INSERT INTO public.techniques VALUES ('ee0a37dc-e458-4321-8245-e7defa78c2ea', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'Dokusō Sundering', 'You activate this technique as part of an attack action.', '{"2": {"effect": "Creatures suffer an additional 1d6 poison damage and 1d6 fire damage from this attack.", "actionType": "passive"}, "4": {"effect": "Creatures suffer an additional 1d6 poison damage and 1d6 fire damage from this attack, and gain one level of the Blood Afire condition. \n\nAt the end of each of the creatures turns, it rolls again against this technique. On a fail, the level of Blood Afire increases by 1d4.", "actionType": "passive"}}', true);
INSERT INTO public.techniques VALUES ('492770f8-6147-404b-90d2-447181a550cd', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'The Diamond Hide of Ijichi', 'Your skin hardens to scales, taking on the aspect of the legendary Dragon Ijichi. At its weakest, the technique provides a brief moment of protection against incoming attacks, but with increased power the technique can greatly increase the user''s resilience for extended periods.', '{"2": {"effect": "You activate this technique as a reaction, which you can take when targeted by an attack or a Saving Throw. When you activate the Technique, you gain a +2 bonus to your AC and Saving Throws against this attack.", "actionType": "reaction"}, "4": {"effect": "You activate this technique as a bonus action, as the power of the hide floods you. You must maintain concentration on this technique as though it were a spell. For one minute, you have a +2 bonus to your AC and Saving Throws.", "actionType": "bonus"}, "6": {"effect": "You activate this technique as an action. While concentrating on this technique, you gain resistance to the following damage types: Cold, Force, Lightning, Necrotic, Radiant, Thunder, Piercing, Slashing.", "actionType": "action", "alternateName": "The Scourge''s Indomitable Scales"}}', true);
INSERT INTO public.techniques VALUES ('4ddaa31a-aaff-4bae-bfaf-90ad24b541b3', 'd0efdf5f-c9f2-4803-8488-4e757d37a202', 'Adachi''s Elusive Strikes', 'Channels the power of the Sea Dragon to strike from unforeseen angles, or trap enemies in a  swirling vortex.', '{"2": {"effect": "Whenever you take the Attack action, you can declare yourself to be using Elusive Strikes. While making attacks in this way, the attacks can originate from any position you can see within 30ft. ", "actionType": "passive"}, "4": {"effect": "When you are targeted by an attack roll, you can spend a Reaction to trade places with another creature within 30ft, who then becomes subject to the attack roll.\n\nIf the creature is not willing, they must succeed on a Dexterity Saving Throw, before being moved. On a success, the creature is able to resist the Technique, and remain in place.", "actionType": "reaction"}, "6": {"effect": "This Technique requires an action to perform, and requires Concentration. Once activated, you may use a bonus action to move this Technique 10ft. Enemies save against the Vortex at the start of their turns, or when they enter the vortex for the first time on their turns.\n\nFor full details, see Crushing Vortex.", "actionType": "action", "alternateName": "The Sea Serpent''s Crushing Vortex"}}', true);
INSERT INTO public.techniques VALUES ('e32cef31-e05e-4869-9aa5-9f6968f3aa27', '50cf2e2f-d76d-452d-8f70-da84c2aadbd4', 'Arboreal Dance', 'You activate this technique as a Bonus Action, and must concentrate on it for the duration, which may be up to one minute. A creature rolls a save against this ability the first time it enters the radius on its turn.', '{"2": {"effect": "The ground within a 10ft radius of you becomes difficult terrain for all creatures of your choice.", "actionType": "bonus"}, "4": {"effect": "The ground within a 10ft radius of you becomes difficult terrain for all creatures of your choice.\n\nCreatures which enter the radius or begin their turn there must make Strength Save — on a fail the creature is restrained. \n\nThe creature repeats this saving throw at the start of each of its turns.", "actionType": "bonus"}, "6": {"effect": "The ground within a 10ft radius of you becomes difficult terrain for all creatures of your choice.\n\nCreatures which enter the radius or begin their turn there must make Strength Save — on a fail the creature is restrained. \n\nIf a creature is still restrained by this technique by the end of its turn, jagged thorns dig into its skin, siphoning its energy to you. The creature suffers 2d8 necrotic damage. You heal for half of this damage.\n\nThe creature repeats this saving throw at the start of each of its turns.", "actionType": "bonus", "alternateName": "[PLACEHOLDER NAME]"}}', true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users VALUES ('user_test', NULL, NULL, NULL, NULL, '2025-07-30 12:05:14.683088', '2025-07-30 12:06:41.059');
INSERT INTO public.users VALUES ('user_1753876205917_rdyz7w0qo', NULL, NULL, NULL, NULL, '2025-07-30 12:04:07.072878', '2025-07-30 12:17:52.793');
INSERT INTO public.users VALUES ('user_1753895290601_cpy1groqy', NULL, NULL, NULL, NULL, '2025-07-30 17:08:31.442555', '2025-07-30 17:08:32.933');
INSERT INTO public.users VALUES ('user_1753895495204_x11y12y3j', NULL, NULL, NULL, NULL, '2025-07-30 17:11:52.727444', '2025-07-30 17:11:53.47');
INSERT INTO public.users VALUES ('user_1753878203821_ou4l89oiw', NULL, NULL, NULL, NULL, '2025-07-30 12:23:28.70317', '2025-07-30 21:47:30.86');
INSERT INTO public.users VALUES ('user_1753978253059_rizbu2eyy', NULL, NULL, NULL, NULL, '2025-07-31 16:10:58.186483', '2025-07-31 16:11:19.02');
INSERT INTO public.users VALUES ('user_1753988299438_yryzm3db2', NULL, NULL, NULL, NULL, '2025-07-31 20:56:00.342144', '2025-07-31 20:56:01.119');


--
-- Data for Name: technique_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.technique_preferences VALUES ('124be609-9996-47c1-acb9-b599ece18bb5', 'user_1753988299438_yryzm3db2', '1cdb8d16-59f6-44bf-a24c-9c7a93272d8c', false, '2025-07-31 20:56:00.415509', '2025-07-31 20:56:01.167');
INSERT INTO public.technique_preferences VALUES ('01fd1b02-e6dd-433e-8f8d-8726ef9c69a0', 'user_1753876205917_rdyz7w0qo', 'f219d4e9-0e35-49e5-8a6c-f9e34127d677', true, '2025-07-30 12:07:00.622557', '2025-07-30 12:16:27.97');
INSERT INTO public.technique_preferences VALUES ('cc4e955d-c0da-438a-992d-9b0224995f4b', 'user_1753876205917_rdyz7w0qo', '0dd66fd2-18fe-4ac2-ba23-635e895554ad', true, '2025-07-30 12:16:33.394219', '2025-07-30 12:17:47.823');
INSERT INTO public.technique_preferences VALUES ('012558cf-9977-41c1-ade7-de33bfd6ac65', 'user_1753876205917_rdyz7w0qo', '1cdb8d16-59f6-44bf-a24c-9c7a93272d8c', false, '2025-07-30 12:12:36.371653', '2025-07-30 12:17:52.834');
INSERT INTO public.technique_preferences VALUES ('f624b7a7-c05a-49fa-99ff-f770b3324073', 'user_1753878203821_ou4l89oiw', 'e32cef31-e05e-4869-9aa5-9f6968f3aa27', false, '2025-07-30 13:23:05.16066', '2025-07-30 13:23:09.584');
INSERT INTO public.technique_preferences VALUES ('cb968f55-63bb-4d59-b019-26dfc66ac1bb', 'user_1753878203821_ou4l89oiw', 'b678f4cd-2afa-45f2-b106-d9d47a12b72a', false, '2025-07-30 13:23:05.459688', '2025-07-30 13:23:10.615');
INSERT INTO public.technique_preferences VALUES ('b7cad6dd-0067-42f3-a9dc-11af8457810a', 'user_1753878203821_ou4l89oiw', '1194556c-d079-473e-a132-3dd70e9238d2', false, '2025-07-30 13:23:06.345475', '2025-07-30 13:23:11.606');
INSERT INTO public.technique_preferences VALUES ('8f8fbc7e-9a81-480f-847f-37c4f8858941', 'user_1753878203821_ou4l89oiw', 'ba0592bf-ee47-413a-8add-778d00db11f5', false, '2025-07-30 15:21:16.29038', '2025-07-30 15:21:17.062');
INSERT INTO public.technique_preferences VALUES ('d373e3c4-78c0-4e31-9d7b-0bb8faee150a', 'user_1753895290601_cpy1groqy', '4ddaa31a-aaff-4bae-bfaf-90ad24b541b3', false, '2025-07-30 17:08:31.502433', '2025-07-30 17:08:32.978');
INSERT INTO public.technique_preferences VALUES ('586a2ad9-b34d-4a85-95e1-b3d58f857d22', 'user_1753878203821_ou4l89oiw', '459a0be1-3225-418c-9399-2b45c40ae4a7', false, '2025-07-30 12:33:53.799868', '2025-07-30 17:09:39.928');
INSERT INTO public.technique_preferences VALUES ('4cf4822e-c062-4f89-9379-a225fc68f343', 'user_1753878203821_ou4l89oiw', 'b5c05ecb-adc2-4031-8fa5-fba857938c13', false, '2025-07-30 12:30:14.126313', '2025-07-30 17:09:40.589');
INSERT INTO public.technique_preferences VALUES ('6592dea8-7c3c-4b52-8f6b-2ed5b37454de', 'user_1753878203821_ou4l89oiw', 'e8d67c4a-49b6-428a-9ae9-fbbd8b0c3cad', false, '2025-07-30 12:23:37.974771', '2025-07-30 17:09:41.374');
INSERT INTO public.technique_preferences VALUES ('5bdd4aa2-9672-4e2c-8ad1-c8552a78599a', 'user_1753878203821_ou4l89oiw', '0dd66fd2-18fe-4ac2-ba23-635e895554ad', false, '2025-07-30 12:23:36.448089', '2025-07-30 17:09:41.978');
INSERT INTO public.technique_preferences VALUES ('bb8912a8-d378-4517-98b8-dd8c060cc459', 'user_1753878203821_ou4l89oiw', '1cdb8d16-59f6-44bf-a24c-9c7a93272d8c', false, '2025-07-30 12:23:31.672006', '2025-07-30 17:09:42.889');
INSERT INTO public.technique_preferences VALUES ('56fb2b0f-9b9c-4e8c-9841-7e75a233ba51', 'user_1753895495204_x11y12y3j', 'ba0592bf-ee47-413a-8add-778d00db11f5', false, '2025-07-30 17:11:52.782476', '2025-07-30 17:11:53.512');
INSERT INTO public.technique_preferences VALUES ('d08a1d0a-7722-44d2-93c0-49311102018e', 'user_1753878203821_ou4l89oiw', 'f219d4e9-0e35-49e5-8a6c-f9e34127d677', false, '2025-07-30 12:23:28.755742', '2025-07-30 21:47:30.905');
INSERT INTO public.technique_preferences VALUES ('9ddab045-37bf-47aa-a674-bbe3fdbfdec8', 'user_1753978253059_rizbu2eyy', '1cdb8d16-59f6-44bf-a24c-9c7a93272d8c', false, '2025-07-31 16:11:05.618107', '2025-07-31 16:11:08.876');
INSERT INTO public.technique_preferences VALUES ('d421d7a4-802c-4cd7-aad2-357a3438e6d0', 'user_1753978253059_rizbu2eyy', 'f219d4e9-0e35-49e5-8a6c-f9e34127d677', false, '2025-07-31 16:10:58.241022', '2025-07-31 16:11:19.065');


--
-- PostgreSQL database dump complete
--

